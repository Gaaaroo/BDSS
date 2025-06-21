package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodDonateForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodDonateFormRepository extends JpaRepository<BloodDonateForm, Integer> {
    List<BloodDonateForm> findAllBloodDonateFormByUserUsername(String username);

    List<BloodDonateForm> findByUserFullNameContainingOrUserPhoneContaining(String fullName, String phone);

    List<BloodDonateForm> findAllByStatus(String status);
}
