package com.swp.bdss.repository;

import com.swp.bdss.entities.DonationProcess;
import com.swp.bdss.entities.ReceivingProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReceivingProcessRepository extends JpaRepository<ReceivingProcess, Long> {
    List<ReceivingProcess> findAllByBloodReceiveFormReceiveId(int receiveId);

    Optional<ReceivingProcess> findByBloodReceiveFormReceiveIdAndStepNumber(int receiveId, int stepNumber);

}
