package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface BloodUnitRepository extends JpaRepository<BloodUnit, Integer> {
    Page<BloodUnit> findAllByOrderByBloodIdDesc(Pageable pageable);

    Page<BloodUnit> findByBloodTypeOrderByBloodIdDesc(String bloodType, Pageable pageable);

    List<BloodUnit> findByStatusNotAndExpiryDateBefore(String status, LocalDateTime now);

    Page<BloodUnit> findByStatusInOrderByBloodIdDesc(List<String> statuses, Pageable pageable);

    Page<BloodUnit> findByBloodTypeAndStatusInOrderByBloodIdDesc(String bloodType, List<String> statuses, Pageable pageable);

    long countByBloodType(String bloodType);

    @Query("SELECT b.bloodType, COUNT(b) FROM BloodUnit b WHERE b.status = :status GROUP BY b.bloodType")
    List<Object[]> countByStatusGroupedByBloodType(@Param("status") String status);

    @Query("SELECT COUNT(b) FROM BloodUnit b")
    long countAllBloodUnits();

    @Query("SELECT b.status, COUNT(b) FROM BloodUnit b GROUP BY b.status")
    List<Object[]> countBloodUnitsGroupedByStatus();


    @Query("""
                SELECT bu FROM BloodUnit bu
                JOIN bu.bloodDonateForm bdf
                JOIN bdf.user u
                WHERE bu.status IN :statuses
                AND LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))
                ORDER BY bu.bloodId DESC
            """)
    Page<BloodUnit> findByStatusInAndFullNameLikeIgnoreCase(
            @Param("statuses") List<String> statuses,
            @Param("fullName") String fullName,
            Pageable pageable
    );

    @Query("""
                SELECT bu FROM BloodUnit bu
                JOIN bu.bloodDonateForm bdf
                JOIN bdf.user u
                WHERE bu.bloodType = :bloodType
                AND bu.status IN :statuses
                AND LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))
                ORDER BY bu.bloodId DESC
            """)
    Page<BloodUnit> findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase(
            @Param("bloodType") String bloodType,
            @Param("statuses") List<String> statuses,
            @Param("fullName") String fullName,
            Pageable pageable
    );

    @Query("""
                SELECT bu FROM BloodUnit bu
                JOIN bu.bloodDonateForm bdf
                JOIN bdf.user u
                WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))
                ORDER BY bu.bloodId DESC
            """)
    Page<BloodUnit> findByFullNameLikeIgnoreCase(
            @Param("fullName") String fullName,
            Pageable pageable
    );

    @Query("SELECT bu FROM BloodUnit bu WHERE bu.status = 'stored' AND bu.receiveForm IS NULL AND bu.bloodType = :bloodType")
    Page<BloodUnit> findAllSuitableBloodUnitByType(@Param("bloodType") String bloodType, Pageable pageable);

    @Query("""
                SELECT b.bloodType, b.volume, COUNT(b)
                FROM BloodUnit b
                WHERE b.status = 'Stored'
                GROUP BY b.bloodType, b.volume
            """)
    List<Object[]> countStoredWholeByBloodTypeAndVolume();

    @Query("""
                SELECT bu FROM BloodUnit bu
                JOIN bu.bloodDonateForm bdf
                JOIN bdf.user u
                WHERE bu.bloodType = :bloodType
                AND LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))
                ORDER BY bu.bloodId DESC
            """)
    Page<BloodUnit> findByBloodTypeAndFullNameLikeIgnoreCase(
            @Param("bloodType") String bloodType,
            @Param("fullName") String fullName,
            Pageable pageable
    );
}

