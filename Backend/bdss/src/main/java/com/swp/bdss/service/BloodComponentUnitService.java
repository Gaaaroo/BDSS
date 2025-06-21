package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodComponentUnitRequest;
import com.swp.bdss.dto.response.BloodComponentUnitResponse;
import com.swp.bdss.entities.*;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodComponentUnitMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodComponentUnitRepository;
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
public class BloodComponentUnitService {
    BloodUnitRepository bloodUnitRepository;
    BloodComponentUnitRepository bloodComponentUnitRepository;
    BloodComponentUnitMapper bloodComponentUnitMapper;
    UserMapper userMapper;
    public String createComponentUnit(BloodComponentUnitRequest request) {
        for (String componentType : request.getComponentTypes()) {
            BloodComponentUnit bloodComponentUnit = new BloodComponentUnit();
            BloodUnit bloodUnit = bloodUnitRepository.findById(request.getBloodId())
                    .orElseThrow(() -> new AppException(ErrorCode.BLOODUNIT_NOT_EXIST));
            bloodComponentUnit.setBloodType(bloodUnit.getBloodType());
            bloodComponentUnit.setComponentType(componentType);
            bloodComponentUnit.setVolume(bloodUnit.getVolume());
            bloodComponentUnit.setStatus("Stored");
            bloodComponentUnit.setCreatedDate(LocalDateTime.now());
            bloodComponentUnit.setExpiryDate(bloodUnit.getExpiryDate());
            bloodComponentUnit.setNote("");
            bloodComponentUnit.setBloodUnit(bloodUnit);
            bloodComponentUnitRepository.save(bloodComponentUnit);
        }
        return "Separate successful";
    }

    public Page<BloodComponentUnitResponse> getAllBloodComponentUnits(Pageable pageable) {
        updateExpiredBloodComponentUnits();
        updateExpiryNotesForComponentUnits();
        return bloodComponentUnitRepository.findAllByOrderByComponentIdDesc(pageable)
                .map(bloodComponentUnit -> {
                    BloodComponentUnitResponse bloodComponentUnitResponse =
                            bloodComponentUnitMapper.toBloodComponentUnitResponse(bloodComponentUnit);
                    User user = bloodComponentUnit.getBloodUnit().getBloodDonateForm().getUser();
                    bloodComponentUnitResponse.setUserResponse(userMapper.toUserResponse(user));
                    return bloodComponentUnitResponse;
                });
    }

    public String updateBloodComponentUnitStatus(String status, int componentId) {
        BloodComponentUnit bloodComponentUnit = bloodComponentUnitRepository.findById(componentId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOODUNIT_NOT_EXIST));
        bloodComponentUnit.setStatus(status);
        bloodComponentUnitRepository.save(bloodComponentUnit);
        return "update status successful";
    }

    public Page<BloodComponentUnitResponse> getAllBloodComponentUnitsByStatus(String status, Pageable pageable) {
        updateExpiredBloodComponentUnits();
        updateExpiryNotesForComponentUnits();

        return bloodComponentUnitRepository.findByStatusOrderByComponentIdDesc(status, pageable)
                .map(bloodComponentUnit -> {
                    BloodComponentUnitResponse response = bloodComponentUnitMapper.toBloodComponentUnitResponse(bloodComponentUnit);
                    User user = bloodComponentUnit.getBloodUnit().getBloodDonateForm().getUser();
                    response.setUserResponse(userMapper.toUserResponse(user));
                    return response;
                });
    }

    public Page<BloodComponentUnitResponse> getAllBloodComponentUnitsByTypeAndStatus(String bloodType, String status, Pageable pageable) {
        updateExpiredBloodComponentUnits();
        updateExpiryNotesForComponentUnits();

        return bloodComponentUnitRepository.findByBloodTypeAndStatusOrderByComponentIdDesc(bloodType, status, pageable)
                .map(bloodComponentUnit -> {
                    BloodComponentUnitResponse response = bloodComponentUnitMapper.toBloodComponentUnitResponse(bloodComponentUnit);
                    User user = bloodComponentUnit.getBloodUnit().getBloodDonateForm().getUser();
                    response.setUserResponse(userMapper.toUserResponse(user));
                    return response;
                });
    }

    public Page<BloodComponentUnitResponse> getAllBloodComponentUnitsByStatusAndFullName(
            List<String> status, String fullName, Pageable pageable) {

        updateExpiredBloodComponentUnits();
        updateExpiryNotesForComponentUnits();

        return bloodComponentUnitRepository.findByStatusInAndFullNameLikeIgnoreCase(status, fullName, pageable)
                .map(component -> {
                    BloodComponentUnitResponse response = bloodComponentUnitMapper.toBloodComponentUnitResponse(component);
                    response.setUserResponse(userMapper.toUserResponse(
                            component.getBloodUnit().getBloodDonateForm().getUser()));
                    return response;
                });
    }

    public Page<BloodComponentUnitResponse> getAllBloodComponentUnitsByTypeAndStatusAndFullName(
            String bloodType, List<String> status, String fullName, Pageable pageable) {

        updateExpiredBloodComponentUnits();
        updateExpiryNotesForComponentUnits();

        return bloodComponentUnitRepository.findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase(bloodType, status, fullName, pageable)
                .map(component -> {
                    BloodComponentUnitResponse response = bloodComponentUnitMapper.toBloodComponentUnitResponse(component);
                    response.setUserResponse(userMapper.toUserResponse(
                            component.getBloodUnit().getBloodDonateForm().getUser()));
                    return response;
                });
    }


    @Transactional
    public void updateExpiredBloodComponentUnits() {
        LocalDateTime now = LocalDateTime.now();

        List<BloodComponentUnit> expiredComponents =
                bloodComponentUnitRepository.findByStatusNotAndExpiryDateBefore("Expired", now);

        for (BloodComponentUnit component : expiredComponents) {
            component.setStatus("Expired");
        }

        bloodComponentUnitRepository.saveAll(expiredComponents);
    }

    @Transactional
    public void updateExpiryNotesForComponentUnits() {
        LocalDate today = LocalDate.now();

        List<BloodComponentUnit> components = bloodComponentUnitRepository.findAll();

        for (BloodComponentUnit component : components) {
            LocalDate expiry = component.getExpiryDate().toLocalDate();
            long days = ChronoUnit.DAYS.between(today, expiry);

            String note;
            if (days > 0) {
                note = "Expires in " + days + " days";
            } else if (days == 0) {
                note = "Expires today";
            } else {
                note = "Expired " + Math.abs(days) + " days ago";
            }

            component.setNote(note);
        }

        bloodComponentUnitRepository.saveAll(components);
    }


}
