package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.request.BloodDonateFormUpdateStatusRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodDonateFormMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodDonateFormRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class BloodDonateFormService {
    UserRepository userRepository;
    BloodDonateFormRepository bloodDonateFormRepository;
    BloodDonateFormMapper bloodDonateFormMapper;
    UserMapper userMapper;

    //create blood donate form (USER)
    public BloodDonateFormResponse createBloodDonateForm(BloodDonateFormCreationRequest request){
        //convert request to entity
        BloodDonateForm bloodDonateForm = bloodDonateFormMapper.toBloodDonateForm(request);

        //lấy user_id từ token
        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        //ktra xem authentication có phải là Jwt không để lấy userId
        if (!(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof Jwt)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        UserResponse userResponse = userMapper.toUserResponse(user);
        bloodDonateForm.setUser(user);
        bloodDonateForm.setRequestDate(LocalDateTime.now());
        bloodDonateForm.setStatus("PENDING");

        BloodDonateFormResponse bloodDonateFormResponse = bloodDonateFormMapper
                .toBloodDonateFormResponse(bloodDonateFormRepository.save(bloodDonateForm));

//        //set user cho response tại vì user nằm ở user và mapstruct ko lấy trường này -> null hoặc sai
         bloodDonateFormResponse.setUserResponse(userResponse);
        return bloodDonateFormResponse;
    }



    //get all donate form of all user and form details (ADMIN)
    public List<BloodDonateFormResponse> getAllUserBloodDonateForm() {
        List<BloodDonateFormResponse> list = new ArrayList<>();
        list = bloodDonateFormRepository.findAll().stream()
                .map(bloodDonateForm -> {
                    BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);

                    User user = bloodDonateForm.getUser();
                    UserResponse userResponse = userMapper.toUserResponse(user);
                    response.setUserResponse(userResponse);
                    return response;
                })
                .toList();
        return list;
    }

    //get all donate form of 1 user and form details (USER)
    public List<BloodDonateFormResponse> getUserBloodDonateForm(){
        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String username = user.getUsername();
        List<BloodDonateForm> list = bloodDonateFormRepository.findAllBloodDonateFormByUserUsername(username);

        return list.stream().map(bloodDonateForm -> {
            BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);

            User savedUser = bloodDonateForm.getUser();
            UserResponse userResponse = userMapper.toUserResponse(savedUser);

            response.setUserResponse(userResponse);
            return response;
        }).toList();
    }

    //get blood donate form by id (ADMIN, USER)
    public BloodDonateFormResponse getBloodDonateFormByDonateId(String donate_id){
        int id = Integer.parseInt(donate_id);
        BloodDonateForm bloodDonateForm = bloodDonateFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood donate form with id " + id + " does not exist."));
        BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);

        User user = bloodDonateForm.getUser();
        UserResponse userResponse = userMapper.toUserResponse(user);
        response.setUserResponse(userResponse);
        return response;
    }

    //delete blood donate form (ADMIN, USER)
    public void deleteBloodDonateForm(String donate_id){
        int id = Integer.parseInt(donate_id);
        BloodDonateForm bloodDonateForm = bloodDonateFormRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_DONATE_FORM_NOT_EXISTED));
        bloodDonateFormRepository.deleteById(id);
    }

    //update form status (ADMIN)
    public BloodDonateFormResponse updateBloodDonateFormStatus(int donate_id, BloodDonateFormUpdateStatusRequest request){
        BloodDonateForm bloodDonateForm = bloodDonateFormRepository.findById(donate_id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_DONATE_FORM_NOT_EXISTED));

        //check status
        bloodDonateForm.setStatus(request.getStatus());
        return bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateFormRepository.save(bloodDonateForm));
    }

    public List<BloodDonateFormResponse> searchBloodDonateFormByKeyWord(String keyword) {
        List<BloodDonateFormResponse> list = bloodDonateFormRepository.findByUserFullNameContainingOrUserPhoneContainingOrUserEmailContaining(keyword, keyword, keyword)
                .stream().map(bloodDonateFormMapper::toBloodDonateFormResponse)
                .toList();

        if(list.isEmpty()){
            throw new AppException(ErrorCode.NO_BLOOD_DONATE_FORM);
        }

        return list;
    }

    public Map<String, Long> countDonateRequestsByStatus() {
        List<BloodDonateForm> forms = bloodDonateFormRepository.findAll();
        return forms.stream()
                .collect(Collectors.groupingBy(
                        BloodDonateForm::getStatus,
                        Collectors.counting()
                ));
    }

    public List<BloodDonateFormResponse> getBloodDonateFormByStatus(String status){
        List<BloodDonateFormResponse> list = bloodDonateFormRepository.findAllByStatus(status)
                .stream().map(bloodDonateFormMapper::toBloodDonateFormResponse)
                .toList();
        return list;
    }

}
