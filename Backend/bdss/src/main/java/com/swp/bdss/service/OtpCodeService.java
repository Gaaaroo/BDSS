package com.swp.bdss.service;


import com.swp.bdss.entities.OtpCode;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.repository.OtpCodeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        otpCode.setCreateAt(LocalDateTime.now());
        otpCode.setExpiresAt(LocalDateTime.now().plusHours(3));
        otpCodeRepository.save(otpCode);
        return otpCode.getOtpCode();
    }

    public String saveResendOtpCode(User user) {
        String otp = generateVerificationCode();
        OtpCode otpCode = otpCodeRepository.findByUser(user)
                .orElseThrow(() -> new AppException(ErrorCode.OTP_NOT_EXISTED));
        otpCode.setUser(user);
        otpCode.setOtpCode(otp);
        otpCode.setCreateAt(LocalDateTime.now());
        otpCode.setExpiresAt(LocalDateTime.now().plusHours(3));
        otpCodeRepository.save(otpCode);
        return otpCode.getOtpCode();
    }

    //check if the otp code is valid
    public boolean isOtpCodeValid(User user, String otpCode){
//        OtpCode existingOtpCode = otpCodeRepository.findByUserAndOtpCode(user, otpCode)
//                .orElseThrow(() -> new RuntimeException("There is no OTP code for this user"));
        OtpCode existingOtpCode = otpCodeRepository.findByUserAndOtpCode(user, otpCode).orElseThrow(() -> new AppException(ErrorCode.OTP_NOT_EXISTED));
        //Xóa nếu OTP quá hạn
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(existingOtpCode.getExpiresAt())) {
//            otpCodeRepository.delete(existingOtpCode);
            throw new AppException(ErrorCode.OTP_CODE_EXPIRED);
        }

        // Check if the OTP code is used within 5 minutes
        // Xóa nếu OTP đã được sử dụng trong vòng 5 phút
        return true;
    }

    public String generateVerificationCode(){
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
