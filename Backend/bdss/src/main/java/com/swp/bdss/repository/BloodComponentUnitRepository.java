package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodComponentUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodComponentUnitRepository extends JpaRepository<BloodComponentUnit, Integer> {
    Page<BloodComponentUnit> findAllByOrderByComponentIdDesc(Pageable pageable);

    List<BloodComponentUnit> findByStatusNotAndExpiryDateBefore(String status, LocalDateTime expiryDate);

    Page<BloodComponentUnit> findByStatusOrderByComponentIdDesc(String status, Pageable pageable);

    Page<BloodComponentUnit> findByBloodTypeAndStatusOrderByComponentIdDesc(String bloodType, String status, Pageable pageable);

    @Query("""
                SELECT bcu FROM BloodComponentUnit bcu
                JOIN bcu.bloodUnit bu
                JOIN bu.bloodDonateForm bdf
                JOIN bdf.user u
                WHERE bcu.status IN :statuses
                AND LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))
                ORDER BY bcu.componentId DESC
            """)
    Page<BloodComponentUnit> findByStatusInAndFullNameLikeIgnoreCase(
            @Param("statuses") List<String> statuses,
            @Param("fullName") String fullName,
            Pageable pageable
    );

    @Query("""
                SELECT bcu FROM BloodComponentUnit bcu
                JOIN bcu.bloodUnit bu
                JOIN bu.bloodDonateForm bdf
                JOIN bdf.user u
                WHERE bu.bloodType = :bloodType
                AND bcu.status IN :statuses
                AND LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))
                ORDER BY bcu.componentId DESC
            """)
    Page<BloodComponentUnit> findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase(
            @Param("bloodType") String bloodType,
            @Param("statuses") List<String> statuses,
            @Param("fullName") String fullName,
            Pageable pageable
    );

    @Query("""
            SELECT bcu FROM BloodComponentUnit bcu
            JOIN bcu.bloodUnit bu
            WHERE bcu.status = 'Stored'
            AND bu.status = 'Separated'
            AND bu.receiveForm IS NULL
            AND bcu.bloodType = :bloodType
            AND bcu.componentType = :componentType
            """)
    Page<BloodComponentUnit> findAllSuitableBloodComponentUnitByType(
            @Param("bloodType") String bloodType,
            @Param("componentType") String componentType,
            Pageable pageable
    );

    @Query("SELECT b.status, COUNT(b) FROM BloodComponentUnit b GROUP BY b.status")
    List<Object[]> countBloodComponentUnitsGroupedByStatus();

    @Query("SELECT b.bloodType, COUNT(b) FROM BloodComponentUnit b WHERE b.status = 'Stored' GROUP BY b.bloodType")
    List<Object[]> countStoredComponentUnitsByBloodType();

    @Query("""
                SELECT b.bloodType, b.componentType, COUNT(b)
                FROM BloodComponentUnit b
                WHERE b.status = 'Stored'
                GROUP BY b.bloodType, b.componentType
            """)
    List<Object[]> countStoredByBloodTypeAndComponentType();

}
