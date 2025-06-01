package com.swp.bdss.controller;

import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin("*")
public class EmailController {
    EmailService emailService;

    @GetMapping("/sendEmail")
    public ResponseEntity<String> sendEmail(@RequestParam String to,@RequestParam String subject) {
        try {
            emailService.sendEmail(to, subject);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            log.error("Error sending email: {}", e.getMessage());
            return ResponseEntity.ok("Failed to send email: " + e.getMessage());
        }
    }

}
