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
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
        log.info("Received componentTypes: {}", request.getComponentTypes());
        BloodUnit bloodUnit = bloodUnitRepository.findById(request.getBloodId())
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_UNIT_NOT_EXIST));
        for (String componentType : request.getComponentTypes()) {
            BloodComponentUnit bloodComponentUnit = new BloodComponentUnit();
            if (bloodUnit.getStatus().equals("Stored")) {
                bloodComponentUnit.setBloodType(bloodUnit.getBloodType());
                bloodComponentUnit.setComponentType(componentType);
                bloodComponentUnit.setVolume(bloodUnit.getVolume());
                bloodComponentUnit.setStatus("Stored");
                bloodComponentUnit.setCreatedDate(LocalDateTime.now());
                bloodComponentUnit.setExpiryDate(bloodUnit.getExpiryDate());
                bloodComponentUnit.setNote("");
                bloodComponentUnit.setBloodUnit(bloodUnit);
            }
            bloodComponentUnitRepository.save(bloodComponentUnit);
            bloodUnitRepository.save(bloodUnit);
        }
        bloodUnit.setStatus("Separated");
        return "Separate successful";
    }

    public Page<BloodComponentUnitResponse> getFilteredBloodComponentUnits(
            String bloodType,
            List<String> statuses,
            String fullName,
            Pageable pageable
    ) {
        updateExpiredBloodComponentUnits();
        updateExpiryNotesForComponentUnits();

        Page<BloodComponentUnit> componentUnits;

        boolean hasBloodType = bloodType != null && !bloodType.isBlank();
        boolean hasStatus = statuses != null && !statuses.isEmpty();
        boolean hasFullName = fullName != null && !fullName.isBlank();

        if (hasBloodType && hasStatus && hasFullName) {
            componentUnits = bloodComponentUnitRepository
                    .findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase(bloodType, statuses, fullName, pageable);
        } else if (hasBloodType && hasStatus) {
            componentUnits = bloodComponentUnitRepository
                    .findByBloodTypeAndStatusInOrderByComponentIdDesc(bloodType, statuses, pageable);
        } else if (!hasBloodType && hasStatus && hasFullName) {
            componentUnits = bloodComponentUnitRepository
                    .findByStatusInAndFullNameLikeIgnoreCase(statuses, fullName, pageable);
        } else if (hasBloodType && hasFullName) {
            componentUnits = bloodComponentUnitRepository
                    .findByBloodTypeAndFullNameLikeIgnoreCase(bloodType, fullName, pageable);
        } else if (hasStatus) {
            componentUnits = bloodComponentUnitRepository
                    .findByStatusInOrderByComponentIdDesc(statuses, pageable);
        } else if (hasBloodType) {
            componentUnits = bloodComponentUnitRepository
                    .findByBloodTypeOrderByComponentIdDesc(bloodType, pageable);
        } else if (hasFullName) {
            componentUnits = bloodComponentUnitRepository
                    .findByFullNameLikeIgnoreCase(fullName, pageable);
        } else {
            componentUnits = bloodComponentUnitRepository
                    .findAllByOrderByComponentIdDesc(pageable);
        }

        return componentUnits.map(component -> {
            BloodComponentUnitResponse response = bloodComponentUnitMapper.toBloodComponentUnitResponse(component);
            response.setUserResponse(
                    userMapper.toUserResponse(component.getBloodUnit().getBloodDonateForm().getUser()));
            if (component.getBloodReceiveForm() != null) {
                response.setReceiveUser(
                        userMapper.toUserResponse(component.getBloodReceiveForm().getUser())
                );
            } else {
                response.setReceiveUser(null);
            }
            return response;
        });
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
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_UNIT_NOT_EXIST));
        bloodComponentUnit.setStatus(status);
        bloodComponentUnitRepository.save(bloodComponentUnit);
        return "update status successful";
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

    public Map<String, Long> countBloodComponentUnitsGroupedByStatus() {
        List<String> allStatuses = List.of("Stored", "Used", "Expired");
        List<Object[]> result = bloodComponentUnitRepository.countBloodComponentUnitsGroupedByStatus();

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

    public Map<String, Long> countStoredComponentUnitsByBloodType() {
        List<String> allBloodTypes = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
        List<Object[]> result = bloodComponentUnitRepository.countStoredComponentUnitsByBloodType();

        Map<String, Long> resultMap = new LinkedHashMap<>();

        // Khởi tạo tất cả nhóm máu có count = 0
        for (String bloodType : allBloodTypes) {
            resultMap.put(bloodType, 0L);
        }

        // Ghi đè count thật nếu có từ DB
        for (Object[] row : result) {
            String bloodType = (String) row[0];
            Long count = (Long) row[1];
            resultMap.put(bloodType, count);
        }

        return resultMap;
    }

    public Map<String, Long> countAllComponentUnitsByBloodType() {
        List<String> allBloodTypes = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
        List<Object[]> result = bloodComponentUnitRepository.countAllComponentUnitsByBloodType();

        Map<String, Long> resultMap = new LinkedHashMap<>();

        for (String bloodType : allBloodTypes) {
            resultMap.put(bloodType, 0L);
        }

        for (Object[] row : result) {
            String bloodType = (String) row[0];
            Long count = (Long) row[1];
            resultMap.put(bloodType, count);
        }

        return resultMap;
    }

    public Map<String, Map<String, Object>> countStoredComponentTypeByBloodType() {
        List<String> bloodTypes = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");
        List<String> componentTypes = List.of("Plasma", "Platelets", "RBCs", "WBCs");

        List<Object[]> result = bloodComponentUnitRepository.countStoredByBloodTypeAndComponentType();

        Map<String, Map<String, Object>> resultMap = new LinkedHashMap<>();

        // Khởi tạo cấu trúc mặc định
        for (String bloodType : bloodTypes) {
            Map<String, Long> components = new LinkedHashMap<>();
            for (String component : componentTypes) {
                components.put(component, 0L);
            }

            Map<String, Object> bloodData = new HashMap<>();
            bloodData.put("total", 0L);
            bloodData.put("components", components);

            resultMap.put(bloodType, bloodData);
        }

        // Ghi đè dữ liệu thật
        for (Object[] row : result) {
            String bloodType = (String) row[0];
            String componentType = (String) row[1];
            Long count = (Long) row[2];

            Map<String, Object> bloodData = resultMap.get(bloodType);
            if (bloodData != null) {
                Map<String, Long> components = (Map<String, Long>) bloodData.get("components");
                components.put(componentType, count);

                long total = components.values().stream().mapToLong(Long::longValue).sum();
                bloodData.put("total", total);
            }
        }

        return resultMap;
    }
}
