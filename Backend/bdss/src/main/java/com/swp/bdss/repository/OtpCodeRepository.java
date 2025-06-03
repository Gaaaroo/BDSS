package com.swp.bdss.repository;

import com.swp.bdss.entities.InvalidatedToken;
import com.swp.bdss.entities.OtpCode;
import com.swp.bdss.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

    @Repository
    public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
        Optional<OtpCode> findByUserAndOtpCode(User user, String otpCode);

        Optional<OtpCode> findByUser(User user);
    }
