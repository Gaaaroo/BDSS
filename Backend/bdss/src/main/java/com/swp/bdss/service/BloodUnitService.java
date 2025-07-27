package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodUnitRequest;
import com.swp.bdss.dto.response.BloodUnitResponse;
import com.swp.bdss.entities.*;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodUnitMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BloodUnitService {
    BloodUnitRepository bloodUnitRepository;
    BloodUnitMapper bloodUnitMapper;
    BloodDonateFormRepository bloodDonateFormRepository;
    UserMapper userMapper;
    BloodComponentUnitRepository bloodComponentUnitRepository;
    BloodReceiveFormRepository bloodReceiveFormRepository;
    NotificationRepository notificationRepository;

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

        User user = bloodDonateForm.getUser();

        Notification notification = Notification.builder()
                .user(user)
                .content("You have successfully donated " + request.getVolume() + " ml of blood.")
                .createdDate(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);

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

    public void assignToReceiveForm(int bloodId, int receiveId, String componentType) {
        // Tìm Receive Form
        BloodReceiveForm receiveForm = bloodReceiveFormRepository.findById(receiveId)
                .orElseThrow(() -> new AppException(ErrorCode.RECEIVE_FORM_NOT_EXISTED));

        if ("whole".equalsIgnoreCase(componentType)) {
            BloodUnit bloodUnit = bloodUnitRepository.findById(bloodId)
                    .orElseThrow(() -> new AppException(ErrorCode.BLOOD_UNIT_NOT_EXIST));

            if (!"Stored".equalsIgnoreCase(bloodUnit.getStatus())) {
                throw new AppException(ErrorCode.BLOOD_UNIT_ALREADY_USED_OR_INVALID);
            }

            bloodUnit.setReceiveForm(receiveForm);
            bloodUnit.setStatus("Used");
            bloodUnitRepository.save(bloodUnit);

        } else {
            BloodComponentUnit component = bloodComponentUnitRepository.findById(bloodId)
                    .orElseThrow(() -> new AppException(ErrorCode.BLOOD_UNIT_NOT_EXIST));

            if (!"Stored".equalsIgnoreCase(component.getStatus())) {
                throw new AppException(ErrorCode.BLOOD_COMPONENT_ALREADY_USED_OR_INVALID);
            }
            component.setBloodReceiveForm(receiveForm);
            component.setStatus("Used");
            bloodComponentUnitRepository.save(component);
        }
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



    public Page<BloodUnitResponse> getFilteredBloodUnits(
            String bloodType,
            List<String> statuses,
            String fullName,
            Pageable pageable
    ) {
        updateExpiryNotes();
        updateExpiredBloodUnits();

        Page<BloodUnit> bloodUnits;

        boolean hasBloodType = bloodType != null && !bloodType.isBlank();
        boolean hasStatus = statuses != null && !statuses.isEmpty();
        boolean hasFullName = fullName != null && !fullName.isBlank();

        // 1. All 3 filters
        if (hasBloodType && hasStatus && hasFullName) {
            bloodUnits = bloodUnitRepository.findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase(
                    bloodType, statuses, fullName, pageable);
        }

        // 2. bloodType + status (no fullName)
        else if (hasBloodType && hasStatus) {
            bloodUnits = bloodUnitRepository.findByBloodTypeAndStatusInOrderByBloodIdDesc(
                    bloodType, statuses, pageable);
        }

        // 3. status + fullName (no bloodType)
        else if (!hasBloodType && hasStatus && hasFullName) {
            bloodUnits = bloodUnitRepository.findByStatusInAndFullNameLikeIgnoreCase(
                    statuses, fullName, pageable);
        }

        // 4b. bloodType + fullName (no status)
        else if (hasBloodType && hasFullName) {
            bloodUnits = bloodUnitRepository.findByBloodTypeAndFullNameLikeIgnoreCase(
                    bloodType, fullName, pageable);
        }

        // 4. Only status
        else if (hasStatus) {
            bloodUnits = bloodUnitRepository.findByStatusInOrderByBloodIdDesc(statuses, pageable);
        }

        // 5. Only bloodType
        else if (hasBloodType) {
            bloodUnits = bloodUnitRepository.findByBloodTypeOrderByBloodIdDesc(bloodType, pageable);
        }

        // 6. Only fullName
        else if (hasFullName) {
            bloodUnits = bloodUnitRepository.findByFullNameLikeIgnoreCase(
                    fullName, pageable);
        }

        // 6. No filters: lấy tất cả
        else {
            bloodUnits = bloodUnitRepository.findAllByOrderByBloodIdDesc(pageable);
        }


        return bloodUnits.map(bloodUnit -> {
            BloodUnitResponse response = bloodUnitMapper.toBloodUnitResponse(bloodUnit);
            response.setUserResponse(userMapper.toUserResponse(
                    bloodUnit.getBloodDonateForm().getUser()));

            if (bloodUnit.getReceiveForm() != null) {
                response.setReceiveUser(
                        userMapper.toUserResponse(bloodUnit.getReceiveForm().getUser())
                );
            } else {
                response.setReceiveUser(null);
            }
            return response;
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

    public String updateBloodUnitStatus(String status, int bloodId) {
        BloodUnit bloodUnit = bloodUnitRepository.findById(bloodId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_UNIT_NOT_EXIST));
        bloodUnit.setStatus(status);
        bloodUnitRepository.save(bloodUnit);
        return "update status successful";
    }

    public long countBloodUnitsByType(String bloodType) {
        return bloodUnitRepository.countStoredByBloodType(bloodType);
    }

    public Map<String, Long> countStoredBloodUnitsGroupedByBloodTypeFull() {
        // Danh sách tất cả các nhóm máu
        List<String> allBloodTypes = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");

        // Kết quả từ DB
        List<Object[]> result = bloodUnitRepository.countByStatusGroupedByBloodType("Stored");

        // Map khởi tạo với tất cả nhóm máu = 0
        Map<String, Long> resultMap = new HashMap<>();
        for (String type : allBloodTypes) {
            resultMap.put(type, 0L);
        }

        // Ghi đè lại các nhóm máu có kết quả từ DB
        for (Object[] row : result) {
            String bloodType = (String) row[0];
            Long count = (Long) row[1];
            resultMap.put(bloodType, count);
        }

        return resultMap;
    }


    public long countAllBloodUnits() {
        return bloodUnitRepository.countAllBloodUnits();
    }

    public Map<String, Long> countBloodUnitsGroupedByStatus() {
        List<String> allStatuses = List.of("Stored", "Used", "Expired");
        List<Object[]> result = bloodUnitRepository.countBloodUnitsGroupedByStatus();

        Map<String, Long> resultMap = new HashMap<>();
        for (String status : allStatuses) {
            resultMap.put(status, 0L);
        }

        for (Object[] row : result) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            resultMap.put(status, count);
        }

        return resultMap;
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

    public List<Map<String, Object>> countBloodInventoryByTypeComponentAndVolume() {
        List<String> bloodTypes = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
        List<String> volumes = List.of("250ml", "350ml", "450ml");
        List<String> componentTypes = List.of("whole", "Plasma", "Platelets", "RBCs", "WBCs");

        // Khởi tạo kết quả mặc định
        Map<String, Map<String, Map<String, Long>>> data = new LinkedHashMap<>();
        for (String bloodType : bloodTypes) {
            Map<String, Map<String, Long>> componentMap = new LinkedHashMap<>();
            for (String component : componentTypes) {
                Map<String, Long> volumeMap = new LinkedHashMap<>();
                for (String volume : volumes) {
                    volumeMap.put(volume, 0L);
                }
                componentMap.put(component, volumeMap);
            }
            data.put(bloodType, componentMap);
        }

        // Lấy dữ liệu Whole
        List<Object[]> wholeData = bloodUnitRepository.countStoredWholeByBloodTypeAndVolume();
        for (Object[] row : wholeData) {
            String bloodType = (String) row[0];
            String volume = row[1] + "ml";
            Long count = (Long) row[2];

            if (data.containsKey(bloodType)) {
                data.get(bloodType).get("whole").put(volume, count);
            }
        }

        // Lấy dữ liệu Component
        List<Object[]> compData = bloodComponentUnitRepository.countStoredComponentByBloodTypeAndTypeAndVolume();
        for (Object[] row : compData) {
            String bloodType = (String) row[0];
            String component = ((String) row[1]);
            String volume = row[2] + "ml";
            Long count = (Long) row[3];


            if (data.containsKey(bloodType) && data.get(bloodType).containsKey(component)) {
                data.get(bloodType).get(component).put(volume, count);
            }
        }

        // Chuyển sang list<Map<String, Object>> để trả ra JSON
        List<Map<String, Object>> result = new ArrayList<>();
        for (String bloodType : bloodTypes) {
            Map<String, Object> bloodTypeEntry = new LinkedHashMap<>();
            bloodTypeEntry.put("bloodType", bloodType);
            bloodTypeEntry.putAll(data.get(bloodType));
            result.add(bloodTypeEntry);
        }

        return result;
    }

}
