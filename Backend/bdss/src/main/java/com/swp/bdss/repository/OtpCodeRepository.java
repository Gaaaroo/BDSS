package com.swp.bdss.repository;

import com.swp.bdss.entities.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

    @Repository
    public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    }
