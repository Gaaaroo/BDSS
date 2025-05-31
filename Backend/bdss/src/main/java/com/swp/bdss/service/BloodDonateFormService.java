package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodDonateFormMapper;
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

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class BloodDonateFormService {
    UserRepository userRepository;
    BloodDonateFormRepository bloodDonateFormRepository;
    BloodDonateFormMapper bloodDonateFormMapper;

    public BloodDonateFormResponse createBloodDonateForm(BloodDonateFormCreationRequest request){
        //convert request to entity
        BloodDonateForm bloodDonateForm = bloodDonateFormMapper.toBloodDonateForm(request);

        //lấy user_id từ token
        var authentication = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //ktra xem authentication có phải là Jwt không để lấy userId
        int userId = authentication instanceof Jwt ? Integer.parseInt(((Jwt) authentication).getClaimAsString("userId")) : -1;

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        //phải chủ động bắt lỗi nha
        noMatchUserInformation(user, request);

        bloodDonateForm.setUser(user);
        bloodDonateForm.setRequest_date(LocalDate.now());
        bloodDonateForm.setStatus("pending");

        BloodDonateFormResponse bloodDonateFormResponse = bloodDonateFormMapper
                .toBloodDonateFormResponse(bloodDonateFormRepository.save(bloodDonateForm));

        bloodDonateFormResponse.setFull_name(user.getFull_name());
        return bloodDonateFormResponse;
    }

    private void noMatchUserInformation(User user, BloodDonateFormCreationRequest request) {
        if (!user.getDob().equals(request.getDob())) {
            throw new RuntimeException("User information does not match with request information1");
        }
        if (!user.getBlood_type().equals(request.getBlood_type())) {
            throw new RuntimeException("User information does not match with request information2");
        }
        if (!user.getGender().equals(request.getGender())) {
            throw new RuntimeException("User information does not match with request information3");
        }
        if (!user.getEmail().equals(request.getEmail())) {
            throw new RuntimeException("User information does not match with request information4");
        }
        if (!user.getPhone().equals(request.getPhone())) {
            throw new RuntimeException("User information does not match with request information5");
        }
        if (!user.getAddress().equals(request.getAddress())) {
            throw new RuntimeException("User information does not match with request information6");
        }
        if (!user.getFull_name().equals(request.getFull_name())) {
            throw new RuntimeException("User information does not match with request information7");
        }
    }


}
