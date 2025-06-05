package com.swp.bdss.configuration;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
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
            "/auth/introspectTokenGoogle"};

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        log.info("Security Config Enabled");
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(PUBLIC_URLS)
                        .permitAll()
                        .anyRequest()
                        .authenticated());

        httpSecurity.oauth2ResourceServer(oath2 -> oath2
                .authenticationManagerResolver(authenticationManagerResolver())
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));


        httpSecurity.csrf(AbstractHttpConfigurer::disable);


        return httpSecurity.build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");

        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
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
