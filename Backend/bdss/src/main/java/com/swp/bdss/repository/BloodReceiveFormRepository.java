package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodReceiveForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodReceiveFormRepository extends JpaRepository<BloodReceiveForm, Integer> {
    List<BloodReceiveForm> findAllByUserUserId(int userId);

    List<BloodReceiveForm> findByUserFullNameContainingOrUserPhoneContaining(String fullName, String phone);

    List<BloodReceiveForm> findAllByStatus(String status);

}
