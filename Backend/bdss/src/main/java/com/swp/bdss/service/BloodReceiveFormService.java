package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.request.BloodReceiveFormUpdateStatusRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodReceiveForm;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodDonateFormMapper;
import com.swp.bdss.mapper.BloodReceiveFormMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodReceiveFormRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
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

    public BloodReceiveFormResponse createBloodReceiveForm(BloodReceiveFormCreationRequest request) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormMapper.toBloodReceiveForm(request);
        //Lay UserID từ token
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        bloodReceiveForm.setBloodType(request.getBloodType());
        bloodReceiveForm.setUser(user);
        bloodReceiveForm.setRequestDate(LocalDate.now());
        bloodReceiveForm.setStatus("PENDING");
        UserResponse userResponse =userMapper.toUserResponse(user);

        BloodReceiveFormResponse bloodReceiveFormResponse = bloodReceiveFormMapper
                .toBloodReceiveFormResponse(bloodReceiveFormRepository.save(bloodReceiveForm));
        bloodReceiveFormResponse.setUser(userResponse);
        return bloodReceiveFormResponse;
    }

    public List<BloodReceiveFormResponse> getAllBloodReceiveForm(){
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
        UserResponse userResponse =userMapper.toUserResponse(bloodReceiveForm.getUser());
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

    public List<BloodReceiveFormResponse> getBloodReceiveFormByStatus(String status){
        List<BloodReceiveFormResponse> list = bloodReceiveFormRepository.findAllByStatus(status)
                .stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                .toList();
        return list;
    }

    public List<BloodReceiveFormResponse> searchBloodReceiveFormByKeyWord(String keyword) {
        List<BloodReceiveFormResponse> list = bloodReceiveFormRepository.findByUserFullNameContainingOrUserPhoneContainingOrUserBloodTypeContaining(keyword, keyword, keyword)
                .stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                .toList();

        if(list.isEmpty()){
            throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM);
        }

        return list;
    }

    public List<BloodReceiveFormResponse> getBloodReceiveFormByPriorityAndOptionalStatus(String priority, String status){
        List<BloodReceiveFormResponse> list = bloodReceiveFormRepository.findAllByPriorityAndOptionalStatus(priority, status).stream()
                .map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                .toList();
        if(list.isEmpty()){
            throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM_WITH_PRIORITY);
        }
        return list;
    }
}
