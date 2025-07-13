package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodDonateForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodDonateFormRepository extends JpaRepository<BloodDonateForm, Integer> {
    List<BloodDonateForm> findAllBloodDonateFormByUserUsername(String username);

    List<BloodDonateForm> findByUserFullNameContainingIgnoreCaseOrUserPhoneContainingIgnoreCase(String fullName, String phone);

    List<BloodDonateForm> findAllByStatus(String status);

    Long countByUserBloodTypeAndStatus(String bloodType, String status);

    Long countByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<BloodDonateForm> findAllByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    Long countByUserBloodType(String bloodType);

    Long countByUserBloodTypeAndRequestDateBetween(String bloodType, LocalDateTime startDate, LocalDateTime endDate);
}
