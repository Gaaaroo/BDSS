package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodUnitRequest;
import com.swp.bdss.dto.response.BloodUnitResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodUnit;
import com.swp.bdss.entities.DonationProcess;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodUnitMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodDonateFormRepository;
import com.swp.bdss.repository.BloodUnitRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BloodUnitService {
    BloodUnitRepository bloodUnitRepository;
    BloodUnitMapper bloodUnitMapper;
    BloodDonateFormRepository bloodDonateFormRepository;
    UserMapper userMapper;

    public BloodUnitResponse addBloodUnit(BloodUnitRequest request) {
        BloodUnit bloodUnit = new BloodUnit();
        BloodDonateForm bloodDonateForm = bloodDonateFormRepository.findById(request.getDonateId())
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_DONATE_FORM_NOT_EXISTED));
        bloodUnit.setBloodType(bloodDonateForm.getUser().getBloodType());
        bloodUnit.setVolume(request.getVolume());
        bloodUnit.setStatus("Stored");
        bloodUnit.setDonatedDate(LocalDateTime.now());
        bloodUnit.setExpiryDate(LocalDateTime.now().plusDays(56));
        bloodUnit.setNote("");

        DonationProcess step4 = bloodDonateForm.getSteps().stream()
                .filter(step -> step.getStepNumber() == 4)
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.STEP_NOT_FINISHED));

        if (!step4.getStatus().equals("DONE")) {
            throw new AppException(ErrorCode.STEP_NOT_DONE);
        }
        bloodUnit.setBloodDonateForm(bloodDonateForm);

        bloodUnitRepository.save(bloodUnit);

         BloodUnitResponse bloodUnitResponse = bloodUnitMapper.toBloodUnitResponse(bloodUnit);
         bloodUnitResponse.setUserResponse(userMapper.toUserResponse(bloodDonateForm.getUser()));
         return bloodUnitResponse;
    }

    public Page<BloodUnitResponse> getAllBloodUnits(Pageable pageable) {
        updateExpiryNotes();
        updateExpiredBloodUnits();
        return bloodUnitRepository.findAllByOrderByBloodIdDesc(pageable)
                .map(bloodUnit -> {
                    BloodUnitResponse bloodUnitResponse = bloodUnitMapper.toBloodUnitResponse(bloodUnit);
                    User user = bloodUnit.getBloodDonateForm().getUser();
                    bloodUnitResponse.setUserResponse(userMapper.toUserResponse(user));
                    return bloodUnitResponse;
                });
    }

    public Page<BloodUnitResponse> getAllBloodUnitType(String bloodType, Pageable pageable) {
        updateExpiryNotes();
        updateExpiredBloodUnits();
        return bloodUnitRepository.findByBloodTypeOrderByBloodIdDesc(bloodType, pageable)
                .map(bloodUnit -> {
                    BloodUnitResponse response = bloodUnitMapper.toBloodUnitResponse(bloodUnit);
                    User user = bloodUnit.getBloodDonateForm().getUser();
                    response.setUserResponse(userMapper.toUserResponse(user));
                    return response;
                });
    }

    public Page<BloodUnitResponse> getAllBloodUnitsByStatus(List<String> statuses, Pageable pageable) {
        updateExpiryNotes();
        updateExpiredBloodUnits();

        return bloodUnitRepository.findByStatusInOrderByBloodIdDesc(statuses, pageable)
                .map(bloodUnit -> {
                    BloodUnitResponse response = bloodUnitMapper.toBloodUnitResponse(bloodUnit);
                    response.setUserResponse(userMapper.toUserResponse(
                            bloodUnit.getBloodDonateForm().getUser()));
                    return response;
                });
    }

    // search blood unit theo fullName
    public Page<BloodUnitResponse> getAllBloodUnitsByStatusAndFullNameDB(List<String> statuses, String fullName, Pageable pageable) {
        updateExpiryNotes();
        updateExpiredBloodUnits();

        return bloodUnitRepository.findByStatusInAndFullNameLikeIgnoreCase(statuses, fullName, pageable)
                .map(unit -> {
                    BloodUnitResponse response = bloodUnitMapper.toBloodUnitResponse(unit);
                    response.setUserResponse(userMapper.toUserResponse(unit.getBloodDonateForm().getUser()));
                    return response;
                });
    }



    //search blood unit theo username và type
    public Page<BloodUnitResponse> getAllBloodUnitTypeByStatus(String bloodType, List<String> statuses, Pageable pageable) {
        updateExpiryNotes();
        updateExpiredBloodUnits();

        return bloodUnitRepository.findByBloodTypeAndStatusInOrderByBloodIdDesc(bloodType, statuses, pageable)
                .map(bloodUnit -> {
                    BloodUnitResponse response = bloodUnitMapper.toBloodUnitResponse(bloodUnit);
                    response.setUserResponse(userMapper.toUserResponse(
                            bloodUnit.getBloodDonateForm().getUser()));
                    return response;
                });
    }

    public Page<BloodUnitResponse> getAllBloodUnitTypeByStatusAndFullNameDB(String bloodType, List<String> statuses, String fullName, Pageable pageable) {
        updateExpiryNotes();
        updateExpiredBloodUnits();

        return bloodUnitRepository.findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase(bloodType, statuses, fullName, pageable)
                .map(unit -> {
                    BloodUnitResponse response = bloodUnitMapper.toBloodUnitResponse(unit);
                    response.setUserResponse(userMapper.toUserResponse(unit.getBloodDonateForm().getUser()));
                    return response;
                });
    }

    public String updateBloodUnitStatus(String status, int bloodId) {
        BloodUnit bloodUnit = bloodUnitRepository.findById(bloodId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_UNIT_NOT_EXIST));
        bloodUnit.setStatus(status);
        bloodUnitRepository.save(bloodUnit);
        return "update status successful";
    }

    public long countBloodUnitsByType(String bloodType) {
        return bloodUnitRepository.countByBloodTypeAndStatus(bloodType, "Stored");
    }
    public long countAllBloodUnits() {
        return bloodUnitRepository.countAllBloodUnits();
    }

    public long countBloodUnitsByStatus(String status) {
        return bloodUnitRepository.countByStatus(status);
    }

    @Transactional
    public void updateExpiredBloodUnits() {
        List<BloodUnit> expiredUnits = bloodUnitRepository.findByStatusNotAndExpiryDateBefore(
                "Expired", LocalDateTime.now());

        for (BloodUnit unit : expiredUnits) {
            unit.setStatus("Expired");
        }
        bloodUnitRepository.saveAll(expiredUnits);
    }

    @Transactional
    public void updateExpiryNotes() {
        List<BloodUnit> allUnits = bloodUnitRepository.findAll();

        LocalDate today = LocalDate.now();

        for (BloodUnit unit : allUnits) {
            LocalDate expiry = unit.getExpiryDate().toLocalDate();
            long daysBetween = ChronoUnit.DAYS.between(today, expiry);

            String note;
            if (daysBetween > 0) {
                note = "Expires in " + daysBetween + " days";
            } else if (daysBetween == 0) {
                note = "Expires today";
            } else {
                note = "Expired " + Math.abs(daysBetween) + " days ago";
            }

            unit.setNote(note);
        }

        bloodUnitRepository.saveAll(allUnits);
    }



}
