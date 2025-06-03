package com.swp.bdss.service;

import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailService {

    JavaMailSender javaMailSender;

    public void sendOtpEmail(String to, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ollamabakery@gmail.com");
        message.setTo(to);
        message.setSubject("Your Registration OTP");
        message.setText("Your OTP code is: " + otp + "\nThis code is valid for 5 minutes.");
        try {
            javaMailSender.send(message);
        }catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

    }

    public void sendOtpEmailV2(String to, String otp) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("ollamabakery@gmail.com");
            helper.setTo(to);
            helper.setSubject("Your Registration OTP");
            String htmlContent = "<h2>Your OTP code is: <b style='color:#d35400;'>" + otp + "</b></h2>"
                    + "<p>This code is valid for <b>5 minutes</b>.</p>";
            helper.setText(htmlContent, true); // true = isHtml
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
    }

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ollamabakery@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        javaMailSender.send(message);
    }


}
