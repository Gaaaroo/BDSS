package com.swp.bdss.service;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.swp.bdss.dto.request.*;
import com.swp.bdss.dto.response.AuthenticationResponse;
import com.swp.bdss.dto.response.IntrospectResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.InvalidatedToken;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.InvalidatedTokenRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    EmailService emailService;
    OtpCodeService otpCodeService;

    @NonFinal
    @Value("${jwt.signerKey}") // spring injects giá trị lúc runtime nên ko dc là FINAL
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public AuthenticationResponse isAuthenticated(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED ));

        boolean authenticated = user.getPassword().equals(request.getPassword());

        if(!authenticated) throw new AppException(ErrorCode.INCORRECT_PASSWORD);

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    //register user and send OTP
    public UserResponse registerUserAndSendOtp(UserCreationRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toUser(request);
        user.setRole("MEMBER");
        user.setStatus("pending");

        User savedUser = userRepository.save(user);
        log.info("{}{}",
                savedUser.getUser_id(),
                savedUser.getEmail()
        );
        // Generate code - Send email to the user
        String otp = otpCodeService.saveOtpCode(savedUser);
        emailService.sendOtpEmail(savedUser.getEmail(), otp);
        return userMapper.toUserResponse(savedUser);
    }

    //verify OTP and activate user
    public UserResponse verifyOtpAndActivateUser(VerifyOtpRequest request){
        //find user by email
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));

        //check status
        if(!user.getStatus().equals("pending")){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        //validate OTP
        boolean isValid = otpCodeService.isOtpCodeValid(user, request.getOtp());
        if(!isValid){
            throw new RuntimeException("Invalid OTP");
        }

        //update user status
        user.setStatus("active");
        User updatedUser = userRepository.save(user);

        //send welcome email


        return userMapper.toUserResponse(updatedUser);
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException{
        try {
            var signToken = verifyToken(request.getToken());

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expirationTime = signToken.getJWTClaimsSet().getExpirationTime();
            Integer userId = signToken.getJWTClaimsSet().getIntegerClaim("userId");

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .token_id(jit)
                    .expiryTime(expirationTime)
                    .user_id(userId)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException e) {
            log.info("Token already invalidated");
        }
    }

    private String generateToken(User user) {
        //header
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        //body
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("bdss.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", user.getRole())
                .claim("userId", user.getUser_id())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try{
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();

        }catch(JOSEException e){
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }


    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException {
        var token = request.getToken();

        boolean isValid = true;
        try{
            verifyToken(token);
        }catch (AppException | ParseException e){
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        //ktra het han
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier); //true - false

        if(!(verified && expirationTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if(invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        log.info("Token verified" + signedJWT);
        return signedJWT;
    }

}
