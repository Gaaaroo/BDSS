package com.swp.bdss.repository;

import com.swp.bdss.entities.DonationProcess;
import com.swp.bdss.entities.ForumPost;
import com.swp.bdss.entities.OtpCode;
import com.swp.bdss.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationProcessRepository extends JpaRepository<DonationProcess, Long> {
    List<DonationProcess> findAllByBloodDonateFormDonateId(int donateId);

    Optional<DonationProcess> findByBloodDonateFormDonateIdAndStepNumber(int donateId, int stepNumber);

}
