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

    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Your Registration OTP");

            // Tạo 6 ô cho từng ký tự OTP
            StringBuilder otpBoxes = new StringBuilder();
            for (char c : otp.toCharArray()) {
                otpBoxes.append(
                        "<span style=\"display:inline-block;width:40px;height:40px;line-height:40px;"
                                + "margin:0 6px;background:#F76C6C;color:#fff;font-size:24px;"
                                + "border-radius:8px;text-align:center;font-weight:bold;letter-spacing:0;\">"
                                + c +
                                "</span>"
                );
            }

            String content = """
        <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 32px;">
            <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #ececec; padding: 32px;">
                <h2 style="color: #F76C6C; margin-bottom: 16px;">Your OTP Code</h2>
                <p style="font-size: 16px; color: #333; margin-bottom: 24px;">
                    Please use the following OTP code to complete your registration:
                </p>
                <div style="text-align: center; margin-bottom: 24px;">
                    %s
                </div>
                <p style="font-size: 14px; color: #888; margin-top: 32px;">
                    This code is valid for 5 minutes.<br>
                    If you did not request this, please ignore this email.
                </p>
                <p style="font-size: 14px; color: #888;">Best regards,<br>BDSS Team</p>
            </div>
        </div>
        """.formatted(otpBoxes.toString());

            helper.setText(content, true); // true = isHtml
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
    }

    public void sendWelcomeEmail(String to){
        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Welcome to Our Blood Donation Service");

            String content = """
        <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 32px;">
            <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #ececec; padding: 32px;">
                <h2 style="color: #F76C6C; margin-bottom: 16px;">Welcome to BDSS!</h2>
                <p style="font-size: 16px; color: #333; margin-bottom: 24px;">
                    Hi there,<br>
                    Thank you for joining <b>BDSS</b>. We’re excited to have you on board!
                </p>
                <div style="text-align: center;">
                                  <a href="http://localhost:5173/" style="background: #F76C6C; color: #fff; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
                                    Get Started
                                  </a>
                                </div>
                <p style="font-size: 14px; color: #888; margin-top: 32px;">
                    If you have any questions, just reply to this email—we’re always happy to help.
                </p>
                <p style="font-size: 14px; color: #888;">Best regards,<br>BDSS Team</p>
            </div>
        </div>
    """;

            helper.setText(content, true); // true = isHtml
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", to, e.getMessage());
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
