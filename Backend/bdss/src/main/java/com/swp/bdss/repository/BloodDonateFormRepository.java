package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodDonateForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodDonateFormRepository extends JpaRepository<BloodDonateForm, Integer> {
    List<BloodDonateForm> findAllBloodDonateFormByUserUsername(String username);

    Page<BloodDonateForm> findByUserFullNameContainingIgnoreCaseOrUserPhoneContainingIgnoreCase(String fullName, String phone, Pageable pageable);

    Page<BloodDonateForm> findAllByStatus(String status, Pageable pageable);

    Page<BloodDonateForm> findAll(Pageable pageable);

    Long countByUserBloodTypeAndStatus(String bloodType, String status);

    Long countByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<BloodDonateForm> findAllByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    Long countByUserBloodType(String bloodType);

    Long countByUserBloodTypeAndRequestDateBetween(String bloodType, LocalDateTime startDate, LocalDateTime endDate);
}
