package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodReceiveForm;
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
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class BloodDonateFormService {
    UserRepository userRepository;
    BloodDonateFormRepository bloodDonateFormRepository;
    BloodDonateFormMapper bloodDonateFormMapper;
    UserMapper userMapper;

    public BloodDonateFormResponse createBloodDonateForm(BloodDonateFormCreationRequest request){
        //convert request to entity
        BloodDonateForm bloodDonateForm = bloodDonateFormMapper.toBloodDonateForm(request);

        //lấy user_id từ token
        var authentication = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //ktra xem authentication có phải là Jwt không để lấy userId
        int userId = authentication instanceof Jwt ? Integer.parseInt(((Jwt) authentication).getClaimAsString("userId")) : -1;

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        UserResponse userResponse = userMapper.toUserResponse(user);
        bloodDonateForm.setUser(user);
        bloodDonateForm.setRequest_date(LocalDate.now());
        bloodDonateForm.setStatus("pending");

        BloodDonateFormResponse bloodDonateFormResponse = bloodDonateFormMapper
                .toBloodDonateFormResponse(bloodDonateFormRepository.save(bloodDonateForm));

//        //set user cho response tại vì user nằm ở user và mapstruct ko lấy trường này -> null hoặc sai
         bloodDonateFormResponse.setUser(userResponse);
        return bloodDonateFormResponse;
    }




    public void getAllUserBloodDonateForm() {}

    //view donate form of user and form details (USER)
    public List<BloodDonateFormResponse> getUserBloodDonateForm(){
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        List<BloodDonateForm> list = bloodDonateFormRepository.findAllBloodDonateFormByUserUsername(username);

        return list.stream().map(bloodDonateForm -> {
            BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);

            User user = bloodDonateForm.getUser();
            UserResponse userResponse = userMapper.toUserResponse(user);

            response.setUser(userResponse);
            return response;
        }).toList();
    }

    //delete blood donate form (ADMIN, USER)
    public void deleteBloodDonateForm(String donate_id){
        int id = Integer.parseInt(donate_id);
        if(!bloodDonateFormRepository.existsById(id)){
            throw new IllegalArgumentException("Blood donate form with id " + donate_id + " does not exist.");

        }
        bloodDonateFormRepository.deleteById(id);
    }

}
