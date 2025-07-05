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
import com.swp.bdss.entities.PasswordResetToken;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.InvalidatedTokenRepository;
import com.swp.bdss.repository.PasswordResetTokenRepository;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    UserService userService;
    PasswordResetTokenRepository passwordResetTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}") // spring injects giá trị lúc runtime nên ko dc là FINAL
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public AuthenticationResponse isAuthenticatedForGoogle(User request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            var user = userRepository.findByEmail(request.getEmail()).get();
            var accessToken = generateAccessToken(user);
            var refreshToken = generateRefreshToken(user);
            return AuthenticationResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .authenticated(true)
                    .build();
        } else {
            var newUser = userService.createUserForLoginGoogle(request.getEmail(), request.getUsername(), request.getImageLink());
            var user = userRepository.findByEmail(newUser.getEmail()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            var accessToken = generateAccessToken(user);
            var refreshToken = generateRefreshToken(user);

            return AuthenticationResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .authenticated(true)
                    .build();
        }
    }

    public AuthenticationResponse isAuthenticated(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED ));

        boolean authenticated = user.getPassword().equals(request.getPassword());

        if(!authenticated) throw new AppException(ErrorCode.INCORRECT_PASSWORD);

        var accessToken = generateAccessToken(user);
        var refreshToken = generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    //register user and send OTP
    public UserResponse registerUserAndSendOtp(UserCreationRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        User user = userMapper.toUser(request);
        user.setRole("MEMBER");
//        user.setStatus("pending");

        User savedUser = userRepository.save(user);
        log.info("{}{}",
                savedUser.getUserId(),
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
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(!user.isActive()){
            throw new AppException(ErrorCode.USER_IS_NOT_ACTIVE);
        }

//        //check status
//        if(!user.getStatus().equals("pending")){
//            throw new AppException(ErrorCode.USER_IS_ACTIVE);
//        }

        //validate OTP
        boolean isValid = otpCodeService.isOtpCodeValid(user, request.getOtp());
        if(!isValid){
            throw new AppException(ErrorCode.OTP_CODE_INVALID);
        }

        //update user status
//        user.setStatus("active");
        user.setActive(true);
        User updatedUser = userRepository.save(user);

        //send welcome email


        return userMapper.toUserResponse(updatedUser);
    }

    //resend OTP to user
    public UserResponse resendOtp(VerifyOtpRequest request){
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(!user.isActive()){
            throw new AppException(ErrorCode.USER_IS_NOT_ACTIVE);
        }

//        if(!user.getStatus().equals("pending")){
//            throw new AppException(ErrorCode.USER_IS_ACTIVE);
//        }
        // Generate code - Send email to the user
        String otp = otpCodeService.saveResendOtpCode(user);
        emailService.sendOtpEmail(user.getEmail(), otp);
        return userMapper.toUserResponse(user);
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            SignedJWT signedJWT = SignedJWT.parse(request.getToken());
            String tokenType = signedJWT.getJWTClaimsSet().getStringClaim("token_type");

            SignedJWT verifiedToken;

            if ("refresh".equals(tokenType)) {
                verifiedToken = verifyRefreshToken(request.getToken());
            } else if ("access".equals(tokenType)) {
                verifiedToken = verifyAccessToken(request.getToken());
            } else {
                throw new AppException(ErrorCode.INVALID_TOKEN_TYPE);
            }

            String jit = verifiedToken.getJWTClaimsSet().getJWTID();
            Date expirationTime = verifiedToken.getJWTClaimsSet().getExpirationTime();
            Integer userId = Integer.parseInt(verifiedToken.getJWTClaimsSet().getSubject());

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            // Nếu token chưa bị thu hồi thì lưu
            if (!invalidatedTokenRepository.existsById(jit)) {
                InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                        .tokenId(jit)
                        .expiryTime(expirationTime)
                        .user(user)
                        .build();

                invalidatedTokenRepository.save(invalidatedToken);
            }

        } catch (AppException e) {
            log.info("Token already invalidated or not valid: {}", e.getMessage());
        }
    }


    public String generateAccessToken(User user) {
        return generateToken(user, VALID_DURATION, true);
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, REFRESHABLE_DURATION, false);
    }

    public String generateToken(User user, long durationInMinutes, boolean isAccessToken) {
        //header
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        //body
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(String.valueOf(user.getUserId()))
                .issuer("bdss.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(durationInMinutes, ChronoUnit.MINUTES).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", user.getRole())
                .claim("UserName", user.getUsername())
                .claim("token_type", isAccessToken ? "access" : "refresh")
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

    public AuthenticationResponse refreshToken(IntrospectRequest request) throws ParseException, JOSEException{
        var signJwt = verifyRefreshToken(request.getToken());

        String tokenType = signJwt.getJWTClaimsSet().getStringClaim("token_type");
        if (!tokenType.equals("refresh")) {
            throw new AppException(ErrorCode.INVALID_TOKEN_TYPE);
        }

        var userId = Integer.parseInt(signJwt.getJWTClaimsSet().getSubject());
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));


        var newAccessToken = generateAccessToken(user);
        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getToken())
                .authenticated(true)
                .build();
    }


    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException {
        var token = request.getToken();

        boolean isValid = true;
        try{
            verifyAccessToken(token);
        }catch (AppException | ParseException e){
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    private SignedJWT verifyAccessToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        // Kiểm tra chữ ký
        if (!signedJWT.verify(verifier)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Kiểm tra thời gian hết hạn (expiration time trong token)
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        if (expirationTime.before(new Date())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Kiểm tra token có bị thu hồi không
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        log.info("Access token verified: " + signedJWT);
        return signedJWT;
    }

    private SignedJWT verifyRefreshToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        if (!signedJWT.verify(verifier)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        if (expirationTime.before(new Date())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Kiểm tra token có bị thu hồi không
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        log.info("Refresh token verified: " + signedJWT);
        return signedJWT;
    }

    // send reset password email
    public void sendResetPasswordEmail(ForgotPasswordRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(!user.isActive()){
            throw new AppException(ErrorCode.USER_IS_NOT_ACTIVE);
        }

        String token = generateResetPasswordToken(user);
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        passwordResetTokenRepository.save(resetToken);

        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendResetPasswordEmail(user.getEmail(), resetUrl);

    }

    public String generateResetPasswordToken(User user) {
        //header
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        //body
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(String.valueOf(user.getUserId()))
                .issuer("bdss.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(5, ChronoUnit.MINUTES).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("email", user.getEmail())
                .claim("scope", user.getRole())
                .claim("token_type", "reset_password")
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try{
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();

        }catch(JOSEException e){
            log.error("Cannot create reset password token", e);
            throw new RuntimeException(e);
        }
    }

    public void resetPassword(ResetPasswordRequest request){
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new AppException(ErrorCode.OTP_NOT_EXISTED));

        if(token.isUsed() || token.getExpiryTime().isBefore(LocalDateTime.now())){
            throw new AppException(ErrorCode.OTP_CODE_EXPIRED);
        }

        User user = token.getUser();
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }

}
