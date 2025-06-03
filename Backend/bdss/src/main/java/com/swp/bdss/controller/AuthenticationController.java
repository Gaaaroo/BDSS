package com.swp.bdss.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.nimbusds.jose.JOSEException;
import com.swp.bdss.dto.request.*;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.AuthenticationResponse;
import com.swp.bdss.dto.response.IntrospectResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    private static final String CLIENT_ID = "940154910752-54ieu25hesbf19tahn90fib6qkk5jia0.apps.googleusercontent.com";

    AuthenticationService authenticationService;

    @PostMapping("/introspectTokenGoogle")
    public ResponseEntity<String> verifyToken(@RequestHeader("Authorization") String authorization) {
        try {
            log.info("Authorization: {}", authorization);
            String idToken = authorization.replace("Bearer ", "");
            log.info("ID Token: {}", idToken);


            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            log.info("Decoded Token: {}", decodedToken);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            log.info("UID: {}", uid);
            log.info("Email: {}", email);

            return ResponseEntity.ok("Token is valid. User email: " + email);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token");
        }
    }

    @PostMapping("/register")
    ApiResponse<UserResponse> register(@RequestBody UserCreationRequest request){
        return ApiResponse.<UserResponse>builder()
                .code(1111)
                .message("OTP sent to your email")
                .data(authenticationService.registerUserAndSendOtp(request))
                .build();
    }

    @PostMapping("/verify")
    ApiResponse<UserResponse> verifyOtp(@RequestBody VerifyOtpRequest request){
        var user = authenticationService.verifyOtpAndActivateUser(request);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("User verified successfully")
                .data(user)
                .build();
    }

    @PostMapping("/resend-otp")
    ApiResponse<UserResponse> resendOtp(@RequestBody VerifyOtpRequest request){
        return ApiResponse.<UserResponse>builder()
                .code(6868)
                .data(authenticationService.resendOtp(request))
                .message("OTP resent successfully")
                .build();
    }

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var isAuthenticated = authenticationService.isAuthenticated(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .message(isAuthenticated.isAuthenticated() ? "Login successful" : "Login failed")
                .data(isAuthenticated)
                .build();

    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var isValid = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .code(1000)
                .message(isValid.isValid() ? "Token valid" : "Token invalid")
                .data(isValid)
                .build();

    }

    @PostMapping("/logout")
    ApiResponse<Void> logout (@RequestBody LogoutRequest request) throws ParseException, JOSEException{
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .code(6666)
                .message("Logout successful")
                .build();
    }

}
