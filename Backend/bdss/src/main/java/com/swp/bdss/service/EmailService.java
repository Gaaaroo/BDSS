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
                                  <a href="https://frontend-production-58e6.up.railway.app/" style="background: #F76C6C; color: #fff; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
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
                    + "<div style=\"font-size: 12px; color: #aaa; text-align: center;\">&copy; 2025 Blood Donation Support System</div>"
                    + "</div>";

            helper.setText(html, true); // true = isHtml

            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
    }

    //mail gửi khuyến khích hiến máu
    public void sendEncourageBloodDonationEmail(String to){
        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Password Reset Request");

            String html =
                    "<div style=\"font-family: Arial, sans-serif; background: #fff7f7; padding: 32px; border-radius: 12px; border: 1px solid #f9b3b3; max-width: 500px; margin: 0 auto;\">" +
                            "<h2 style=\"color: #e53935; text-align: center;\">❤️ We Need Your Kindness ❤️</h2>" +
                            "<p style=\"font-size: 16px; color: #333;\">Dear friend,</p>" +
                            "<p style=\"font-size: 16px; color: #333;\">Our blood bank is currently running low, and many patients are waiting for a chance at life. Your blood donation can make a real difference and bring hope to those in urgent need.</p>" +
                            "<div style=\"background: #ffeaea; padding: 16px; border-radius: 8px; margin: 16px 0;\">" +
                            "<strong style=\"color: #d32f2f;\">If you are able, please consider donating blood today. Every drop counts!</strong>" +
                            "</div>" +
                            "<ul style=\"font-size: 15px; color: #444;\">" +
                            "<li><b>Where:</b> Your nearest blood donation center</li>" +
                            "<li><b>When:</b> 8:00 AM – 5:00 PM, every day</li>" +
                            "<li><b>Contact:</b> 0123 456 789</li>" +
                            "</ul>" +
                            "<p style=\"font-size: 15px; color: #333;\">Thank you for your compassion and support. Together, we can save lives.</p>" +
                            "<p style=\"font-size: 15px; color: #e53935; font-weight: bold; text-align: center;\">Donate blood, share life!</p>" +
                            "<hr style=\"margin: 24px 0; border: none; border-top: 1px solid #f9b3b3;\">" +
                            "<p style=\"font-size: 13px; color: #888; text-align: center;\">With gratitude,<br>The BDSS Team</p>" +
                            "</div>";
            helper.setText(html, true); // true = isHtml
            javaMailSender.send(message);
        }catch(Exception e){
            log.error("Failed to send encourage blood donation email to {}: {}", to, e.getMessage());
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
    }

    public void sendRecoveryReminderEmail(String to, int reminderNumber) {
        String subject = "";
        String html = "";
        switch (reminderNumber) {
            case 1:
                subject = "Day 21: Nutrition Reminder After Blood Donation";
                html = """
                    <div style='font-family: Arial,sans-serif; background: #f7fafd; padding: 24px; border-radius: 10px; border: 1px solid #b3e5fc; max-width: 480px; margin: 0 auto;'>
                        <h2 style='color: #0288d1; text-align: center;'>21 Days After Donation</h2>
                        <p>Dear donor,<br>It's been 21 days since your blood donation. Please continue to eat iron-rich foods and drink plenty of water to help your body recover.</p>
                        <ul><li>Eat red meat, beans, green vegetables</li><li>Stay hydrated</li></ul>
                        <p>Thank you for your kindness!</p>
                        <p style='font-size:13px; color:#888; text-align:center;'>BDSS Team</p>
                    </div>
                """;
                break;
            case 2:
                subject = "Day 42: Keep Taking Care of Your Health!";
                html = """
                    <div style='font-family: Arial,sans-serif; background: #f7fafd; padding: 24px; border-radius: 10px; border: 1px solid #b3e5fc; max-width: 480px; margin: 0 auto;'>
                        <h2 style='color: #0288d1; text-align: center;'>42 Days After Donation</h2>
                        <p>Dear donor,<br>It's been 42 days since your donation. Keep up your healthy habits and remember to rest well.</p>
                        <ul><li>Continue eating healthy</li><li>Get enough sleep</li></ul>
                        <p>Thank you for being a hero!</p>
                        <p style='font-size:13px; color:#888; text-align:center;'>BDSS Team</p>
                    </div>
                """;
                break;
            case 3:
                subject = "Day 63: You're Almost Ready to Donate Again!";
                html = """
                    <div style='font-family: Arial,sans-serif; background: #f7fafd; padding: 24px; border-radius: 10px; border: 1px solid #b3e5fc; max-width: 480px; margin: 0 auto;'>
                        <h2 style='color: #0288d1; text-align: center;'>63 Days After Donation</h2>
                        <p>Dear donor,<br>It's been 63 days since your donation. You're almost eligible to donate again. Keep taking care of yourself!</p>
                        <ul><li>Eat well</li><li>Stay active</li></ul>
                        <p>We appreciate your generosity!</p>
                        <p style='font-size:13px; color:#888; text-align:center;'>BDSS Team</p>
                    </div>
                """;
                break;
            case 4:
                subject = "Day 84: You Can Donate Blood Again!";
                html = """
                    <div style='font-family: Arial,sans-serif; background: #f7fafd; padding: 24px; border-radius: 10px; border: 1px solid #b3e5fc; max-width: 480px; margin: 0 auto;'>
                        <h2 style='color: #0288d1; text-align: center;'>84 Days After Donation</h2>
                        <p>Dear donor,<br>It's been 84 days since your last donation. You are now eligible to donate blood again if you wish. Thank you for your continued support!</p>
                        <p>Ready to save more lives?</p>
                        <p style='font-size:13px; color:#888; text-align:center;'>BDSS Team</p>
                    </div>
                """;
                break;
            default:
                subject = "Blood Donation Recovery Reminder";
                html = "<p>Thank you for your donation!</p>";
        }
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send reminder email to {}: {}", to, e.getMessage());
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
