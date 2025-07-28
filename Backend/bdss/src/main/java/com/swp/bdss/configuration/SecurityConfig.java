package com.swp.bdss.configuration;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Value("${jwt.signerKey}")
    private String signerKey;


    private final String[] PUBLIC_URLS = {"/auth/login", "/auth/introspect", "/auth/logout",
            "/auth/refresh", "/users", "/auth/register", "/auth/verify", "/auth/resend-otp",
            "/auth/loginWithTokenGoogle", "/blog", "blog/top3", "/auth/forgot-password", "/auth/reset-password", "/forum", "/bloodUnit/count/by-blood-types",
            "/forum/count-all", "/comment/count-all", "/users/count-all"};
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        log.info("Security Config Enabled");
        httpSecurity
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(PUBLIC_URLS).permitAll()
                        .anyRequest()
                        .authenticated());

        httpSecurity.oauth2ResourceServer(oath2 -> oath2
                .authenticationManagerResolver(authenticationManagerResolver())
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
        );


        httpSecurity.csrf(AbstractHttpConfigurer::disable);


        return httpSecurity.build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");

        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();

        // Tạo validator check token_type mặc định
        JwtTimestampValidator timestampValidator = new JwtTimestampValidator();
        OAuth2TokenValidator<Jwt> combinedValidator = getJwtOAuth2TokenValidator(timestampValidator);
        decoder.setJwtValidator(combinedValidator);
        return decoder;
    }

    private static OAuth2TokenValidator<Jwt> getJwtOAuth2TokenValidator(JwtTimestampValidator timestampValidator) {
        OAuth2TokenValidator<Jwt> tokenTypeValidator = jwt -> {
            String tokenType = jwt.getClaimAsString("token_type");
            if(!tokenType.equals("access")) {
                return OAuth2TokenValidatorResult.failure(
                        new OAuth2Error("invalid_token_type", "Only access tokens are allowed", null));
            }
            return OAuth2TokenValidatorResult.success();
        };

        return new DelegatingOAuth2TokenValidator<>(timestampValidator, tokenTypeValidator);
    }

    /**
     * Resolver để chọn decoder phù hợp theo token
     */
    @Bean
    public AuthenticationManagerResolver<HttpServletRequest> authenticationManagerResolver() {
        return request -> {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    String[] parts = token.split("\\.");
                    if (parts.length == 3) {
                        String headerJson = new String(Base64.getDecoder().decode(parts[0]));
                        if (headerJson.contains("\"alg\":\"RS256\"")) {
                            // Firebase token - không xử lý ở Spring Security, cho phép request qua
                            return authentication -> {
                                log.debug("Bypassing authentication for Firebase token.");
                                return null;
                            };
                        } else if (headerJson.contains("\"alg\":\"HS512\"")) {
                            // HS512 token - xử lý qua decoder
                            JwtAuthenticationProvider provider = new JwtAuthenticationProvider(jwtDecoder());
                            return provider::authenticate;
                        }
                    }
                } catch (Exception e) {
                    log.error("Failed to inspect JWT header: {}", e.getMessage());
                }
            }

            throw new BadCredentialsException("Invalid or unsupported JWT token");
        };
    }

}
