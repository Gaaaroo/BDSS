package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodDonateForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodDonateFormRepository extends JpaRepository<BloodDonateForm, Integer> {
    List<BloodDonateForm> findAllBloodDonateFormByUserUsername(String username);

    @Query("SELECT d FROM BloodDonateForm d WHERE " +
            "(LOWER(d.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(d.user.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(d.user.bloodType) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR d.status = :status) ORDER BY d.donateId DESC")
    Page<BloodDonateForm> searchByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") String status, Pageable pageable);

    Page<BloodDonateForm> findAllByStatusOrderByDonateIdDesc(String status, Pageable pageable);

    @Query("SELECT d FROM BloodDonateForm d ORDER BY d.donateId DESC")
    Page<BloodDonateForm> findAll(Pageable pageable);

    Long countByUserBloodTypeAndStatus(String bloodType, String status);

    Long countByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<BloodDonateForm> findAllByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    Long countByUserBloodType(String bloodType);

    Long countByUserBloodTypeAndRequestDateBetween(String bloodType, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT f FROM BloodDonateForm f JOIN FETCH f.user")
    List<BloodDonateForm> findAllWithUser();
}
