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
//        message.setFrom("ollamabakery@gmail.com");
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

    public void sendResetPasswordEmail1(String to, String url){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, please click the link below:\n" + url);
        try {
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
    }

    public void sendResetPasswordEmail(String to, String url) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Password Reset Request");

            String html = "<div style=\"font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #f9b3b3; padding: 32px;\">"
                    + "<h2 style=\"color: #F76C6C; text-align: center;\">Reset Your Password</h2>"
                    + "<p style=\"font-size: 16px; color: #333;\">We received a request to reset your password.</p>"
                    + "<p style=\"font-size: 16px; color: #333;\">Click the button below to set a new password:</p>"
                    + "<div style=\"text-align: center; margin: 24px 0;\">"
                    + "<a href=\"" + url + "\" style=\"background: #F76C6C; color: #fff; padding: 12px 32px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 16px;\">Reset Password</a>"
                    + "</div>"
                    + "<p style=\"font-size: 14px; color: #888;\">If you did not request a password reset, please ignore this email.</p>"
                    + "<hr style=\"margin: 24px 0; border: none; border-top: 1px solid #eee;\">"
                    + "<div style=\"font-size: 12px; color: #aaa; text-align: center;\">&copy; 2025 Your App Name</div>"
                    + "</div>";

            helper.setText(html, true); // true = isHtml

            javaMailSender.send(message);
        } catch (Exception e) {
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
