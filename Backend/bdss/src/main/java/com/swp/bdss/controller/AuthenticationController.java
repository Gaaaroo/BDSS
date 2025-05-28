package com.swp.bdss.controller;

import com.nimbusds.jose.JOSEException;
import com.swp.bdss.dto.request.AuthenticationRequest;
import com.swp.bdss.dto.request.IntrospectRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.AuthenticationResponse;
import com.swp.bdss.dto.response.IntrospectResponse;
import com.swp.bdss.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var isAuthenticated = authenticationService.isAuthenticated(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(6868)
                .message(isAuthenticated.isAuthenticated() ? "Login successful" : "Login failed")
                .data(isAuthenticated)
                .build();

    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var isValid = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .code(8686)
                .message(isValid.isValid() ? "Token valid" : "Token invalid")
                .data(isValid)
                .build();

    }

}
