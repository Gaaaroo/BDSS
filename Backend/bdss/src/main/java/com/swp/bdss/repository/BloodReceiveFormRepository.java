package com.swp.bdss.repository;

import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodReceiveForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodReceiveFormRepository extends JpaRepository<BloodReceiveForm, Integer> {
    List<BloodReceiveForm> findAllByUserUserId(int userId);

    Page<BloodReceiveForm> findByUserFullNameContainingOrUserPhoneContainingOrUserBloodTypeContaining(String fullName, String phone, String bloodType, Pageable pageable);

    Page<BloodReceiveForm> findAllByStatus(String status, Pageable pageable);

    @Query("SELECT b FROM BloodReceiveForm b WHERE b.priority = :priority AND (:status IS NULL OR b.status = :status)")
    Page<BloodReceiveForm> findAllByPriorityAndOptionalStatus(String priority, String status, Pageable pageable);

    List<BloodReceiveForm> findAllByBloodTypeAndComponentTypeAndStatus(String bloodType, String componentType, String status);

    List<BloodReceiveForm> findAllByBloodTypeAndComponentTypeNotAndStatus(String bloodType, String componentType, String status);

    long countByBloodTypeAndComponentTypeAndStatusIn(String bloodType, String componentType, List<String> statuses);
    long countByBloodTypeAndComponentTypeNotAndStatusIn(String bloodType, String componentType, List<String> statuses);

    Long countByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<BloodReceiveForm> findAllByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    Long countByBloodTypeAndComponentType(String bloodType, String componentType);

    Long countByBloodTypeAndRequestDateBetween(String bloodType, LocalDateTime startDate, LocalDateTime endDate);

    Page<BloodReceiveForm> findAll(Pageable pageable);
}
