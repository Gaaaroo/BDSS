package com.swp.bdss.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
        javaMailSender.send(message);
    }

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ollamabakery@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        javaMailSender.send(message);
    }
    public void sendEmail(String to, String subject) {
        String body = "Lô kiu em iu";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ollamabakery@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        javaMailSender.send(message);
    }


}
