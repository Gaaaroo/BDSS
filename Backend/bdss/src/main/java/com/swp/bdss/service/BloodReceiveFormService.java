package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.request.BloodReceiveFormUpdateStatusRequest;
import com.swp.bdss.dto.response.*;
import com.swp.bdss.entities.*;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.*;
import com.swp.bdss.repository.BloodComponentUnitRepository;
import com.swp.bdss.repository.BloodReceiveFormRepository;
import com.swp.bdss.repository.BloodUnitRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BloodReceiveFormService {
    private final BloodDonateFormMapper bloodDonateFormMapper;
    UserRepository userRepository;
    BloodReceiveFormRepository bloodReceiveFormRepository;
    BloodReceiveFormMapper bloodReceiveFormMapper;
    UserMapper userMapper;
    BloodUnitRepository bloodUnitRepository;
    BloodComponentUnitRepository bloodComponentUnitRepository;
    BloodUnitMapper bloodUnitMapper;
    BloodComponentUnitMapper bloodComponentUnitMapper;

    public List<BloodResponse> getAllSuitableBloodByReceiveId(int receiveId, int page, int size) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(receiveId)
                .orElseThrow(() -> new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM));
        String bloodType = bloodReceiveForm.getBloodType();
        String componentType = bloodReceiveForm.getComponentType();
        Pageable pageable = PageRequest.of(page, size);

        if (componentType.equalsIgnoreCase("Whole")) {
            Page<BloodUnit> bloodUnits = bloodUnitRepository.findAllSuitableBloodUnitByType(bloodType, pageable);

            return bloodUnits.getContent().stream()
                    .filter(bloodUnit -> bloodUnit.getStatus().equalsIgnoreCase("stored"))
                    .map(bloodUnit -> {
                        BloodUnitResponse response = bloodUnitMapper.toBloodUnitResponse(bloodUnit);
                        response.setUserResponse(userMapper.toUserResponse(bloodUnit.getBloodDonateForm().getUser()));
                        return response;
                    }).collect(Collectors.toList());
        } else {
            List<BloodResponse> responses = new ArrayList<>();
            for (BloodComponentUnit bloodComponentUnit : bloodComponentUnitRepository
                    .findAllSuitableBloodComponentUnitByType(bloodType, componentType, pageable)) {
                if (bloodComponentUnit.getStatus().equalsIgnoreCase("Stored") &&
                        bloodComponentUnit.getComponentType().equalsIgnoreCase(bloodReceiveForm.getComponentType())) {
                    BloodComponentUnitResponse bloodComponentUnitResponse = bloodComponentUnitMapper.toBloodComponentUnitResponse(bloodComponentUnit);
                    bloodComponentUnitResponse.setUserResponse(userMapper.toUserResponse(bloodComponentUnit.getBloodUnit().getBloodDonateForm().getUser()));
                    responses.add(bloodComponentUnitResponse);
                }
            }
            return responses;
        }

    }

    public BloodReceiveFormResponse createBloodReceiveForm(BloodReceiveFormCreationRequest request) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormMapper.toBloodReceiveForm(request);
        //Lay UserID từ token
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean canRegister = false;

        if (user.getBloodDonateForms().isEmpty()) {
            canRegister = true;
        } else {
            BloodReceiveForm lastForm = user.getBloodReceiveForms().getLast();

            if (lastForm.getStatus().equalsIgnoreCase("REJECTED") || lastForm.getStatus().equalsIgnoreCase("APPROVED")) {
                canRegister = true;
            }
        }

        if (!canRegister) {
            throw new AppException(ErrorCode.NOT_ELIGIBLE_TO_REGISTER_RECEIVE);
        }


        bloodReceiveForm.setBloodType(request.getBloodType());
        bloodReceiveForm.setUser(user);
        bloodReceiveForm.setRequestDate(LocalDate.now());
        bloodReceiveForm.setStatus("PENDING");
        UserResponse userResponse = userMapper.toUserResponse(user);

        BloodReceiveFormResponse bloodReceiveFormResponse = bloodReceiveFormMapper
                .toBloodReceiveFormResponse(bloodReceiveFormRepository.save(bloodReceiveForm));
        bloodReceiveFormResponse.setUser(userResponse);
        return bloodReceiveFormResponse;
    }

    public List<BloodReceiveFormResponse> getAllBloodReceiveForm() {
        List<BloodReceiveFormResponse> formReceiveList = new ArrayList<>();
        formReceiveList = bloodReceiveFormRepository.findAll().stream()
                .map(bloodReceiveForm -> {
                    BloodReceiveFormResponse bloodReceiveFormResponse = bloodReceiveFormMapper.toBloodReceiveFormResponse(bloodReceiveForm);
                    User user = bloodReceiveForm.getUser();
                    UserResponse userResponse = userMapper.toUserResponse(user);
                    bloodReceiveFormResponse.setUser(userResponse);
                    return bloodReceiveFormResponse;
                })
                .toList();
        return formReceiveList;
    }

    public BloodReceiveFormResponse getBloodReceiveFormById(int id) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));
        BloodReceiveFormResponse bloodReceiveFormResponse = bloodReceiveFormMapper
                .toBloodReceiveFormResponse(bloodReceiveForm);
        bloodReceiveFormResponse.setReceiveId(bloodReceiveForm.getReceiveId());
        User user = bloodReceiveForm.getUser();
        UserResponse userResponse = userMapper.toUserResponse(user);
        bloodReceiveFormResponse.setUser(userResponse);

        return bloodReceiveFormResponse;
    }

    public List<BloodReceiveFormResponse> getMyBloodReceiveForm() {
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        List<BloodReceiveForm> list = bloodReceiveFormRepository.findAllByUserUserId(userId);
        return list.stream().map(bloodReceiveForm -> {
                    BloodReceiveFormResponse bloodReceiveFormResponse = bloodReceiveFormMapper.toBloodReceiveFormResponse(bloodReceiveForm);
                    User user = bloodReceiveForm.getUser();
                    UserResponse userResponse = userMapper.toUserResponse(user);
                    bloodReceiveFormResponse.setUser(userResponse);
                    return bloodReceiveFormResponse;
                })
                .toList();
    }

    public BloodReceiveFormResponse updateBloodReceiveFormStatus(int receiveId, BloodReceiveFormUpdateStatusRequest request) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(receiveId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        bloodReceiveForm.setStatus(request.getStatus());
        BloodReceiveFormResponse bloodReceiveFormResponse =
                bloodReceiveFormMapper.toBloodReceiveFormResponse(bloodReceiveFormRepository.save(bloodReceiveForm));
        UserResponse userResponse = userMapper.toUserResponse(bloodReceiveForm.getUser());
        bloodReceiveFormResponse.setUser(userResponse);
        return bloodReceiveFormResponse;
    }

    public void deleteBloodReceiveForm(String id) {
        bloodReceiveFormRepository.deleteById(Integer.parseInt(id));
    }

    public Map<String, Long> countReceiveRequestsByStatus() {
        List<BloodReceiveForm> forms = bloodReceiveFormRepository.findAll();
        return forms.stream()
                .collect(Collectors.groupingBy(
                        BloodReceiveForm::getStatus,
                        Collectors.counting()
                ));
    }

    public List<BloodReceiveFormResponse> getBloodReceiveFormByStatus(String status) {
        List<BloodReceiveFormResponse> list = bloodReceiveFormRepository.findAllByStatus(status)
                .stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                .toList();
        return list;
    }

    public List<BloodReceiveFormResponse> searchBloodReceiveFormByKeyWord(String keyword) {
        List<BloodReceiveFormResponse> list = bloodReceiveFormRepository.findByUserFullNameContainingOrUserPhoneContainingOrUserBloodTypeContaining(keyword, keyword, keyword)
                .stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                .toList();

        if (list.isEmpty()) {
            throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM);
        }

        return list;
    }

    public List<BloodReceiveFormResponse> getBloodReceiveFormByPriorityAndOptionalStatus(String priority, String status) {
        List<BloodReceiveFormResponse> list = bloodReceiveFormRepository.findAllByPriorityAndOptionalStatus(priority, status).stream()
                .map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                .toList();
        if (list.isEmpty()) {
            throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM_WITH_PRIORITY);
        }
        return list;
    }

    public List<BloodReceiveFormResponse> getBloodReceiveFormByBloodTypeAndComponentTypeAndStatus(String bloodType, String componentType) {
        List<BloodReceiveFormResponse> list;
        if(componentType.equalsIgnoreCase("Whole")) {
            list = bloodReceiveFormRepository.findAllByBloodTypeAndComponentTypeAndStatus(bloodType, componentType, "PROCESSING")
                    .stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                    .toList();
            log.info(list.toString());
        }else{
            componentType = "Whole";
            list = bloodReceiveFormRepository.findAllByBloodTypeAndComponentTypeNotAndStatus(bloodType, componentType, "PROCESSING")
                    .stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                    .toList();
            log.info(list.toString());

        }

        if(list.isEmpty()){
            throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM);
        }
        return list;
    }

    public long countBloodReceiveFormByBloodTypeAndComponentTypeAndStatus(String bloodType, String componentType) {
        long count;
        if (componentType.equalsIgnoreCase("Whole")) {
            count = bloodReceiveFormRepository.countByBloodTypeAndComponentTypeAndStatus(
                    bloodType, componentType, "PROCESSING"
            );
            log.info("Whole count: " + count);
        } else {
            // Đếm những đơn có componentType khác "Whole"
            count = bloodReceiveFormRepository.countByBloodTypeAndComponentTypeNotAndStatus(
                    bloodType, "Whole", "PROCESSING"
            );
            log.info("Not Whole count: " + count);
        }

        return count;
    }

}
