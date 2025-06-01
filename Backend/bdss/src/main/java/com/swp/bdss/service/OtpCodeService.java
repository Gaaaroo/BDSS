package com.swp.bdss.service;


import com.swp.bdss.entities.OtpCode;
import com.swp.bdss.entities.User;
import com.swp.bdss.repository.OtpCodeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OtpCodeService {

    OtpCodeRepository otpCodeRepository;

    public String saveOtpCode(User user) {
        String otp = generateVerificationCode();
        OtpCode otpCode = new OtpCode();
        otpCode.setUser(user);
        otpCode.setOtpCode(otp);
        otpCode.setExpiresAt(LocalDateTime.now().plusHours(3));
        otpCodeRepository.save(otpCode);
        return otpCode.getOtpCode();
    }


    public String generateVerificationCode(){
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
