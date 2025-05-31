package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodDonateForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodDonateFormRepository extends JpaRepository<BloodDonateForm, Integer> {
}
