package com.swp.bdss.repository;

import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodReceiveForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodReceiveFormRepository extends JpaRepository<BloodReceiveForm, Integer> {
    List<BloodReceiveForm> findAllByUserUserId(int userId);

    List<BloodReceiveForm> findByUserFullNameContainingOrUserPhoneContainingOrUserBloodTypeContaining(String fullName, String phone, String bloodType);

    List<BloodReceiveForm> findAllByStatus(String status);

    @Query("SELECT b FROM BloodReceiveForm b WHERE b.priority = :priority AND (:status IS NULL OR b.status = :status)")
    List<BloodReceiveForm> findAllByPriorityAndOptionalStatus(String priority, String status);

    List<BloodReceiveForm> findAllByBloodTypeAndComponentTypeAndStatus(String bloodType, String componentType, String status);

    List<BloodReceiveForm> findAllByBloodTypeAndComponentTypeNotAndStatus(String bloodType, String componentType, String status);

    long countByBloodTypeAndComponentTypeAndStatus(String bloodType, String componentType, String status);
    long countByBloodTypeAndComponentTypeNotAndStatus(String bloodType, String componentType, String status);

    Long countByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
