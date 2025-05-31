package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.entities.BloodReceiveForm;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodReceiveFormMapper;
import com.swp.bdss.repository.BloodReceiveFormRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BloodReceiveFormService {
    UserRepository userRepository;
    BloodReceiveFormRepository bloodReceiveFormRepository;
    BloodReceiveFormMapper bloodReceiveFormMapper;

    public BloodReceiveFormResponse createBloodReceiveForm(BloodReceiveFormCreationRequest request) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormMapper.toBloodReceiveForm(request);

        //Lay UserID từ token
        var authentication = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = authentication instanceof Jwt ?
                Integer.parseInt(((Jwt) authentication).getClaimAsString("userId")) : -1;

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        bloodReceiveForm.setUser(user);
        bloodReceiveForm.setRequest_date(LocalDate.now());
        bloodReceiveForm.setStatus("pending");

        return bloodReceiveFormMapper
                .toBloodReceiveFormResponse(bloodReceiveFormRepository.save(bloodReceiveForm));

    }

    public List<BloodReceiveFormResponse> getAllBloodReceiveForm(){
        List<BloodReceiveFormResponse> formReceiveList = new ArrayList<>();
        formReceiveList = bloodReceiveFormRepository.findAll().stream()
                .map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                .toList();
        return formReceiveList;
    }

    public BloodReceiveFormResponse getBloodReceiveFormById(int id) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));
        BloodReceiveFormResponse bloodReceiveFormResponse = bloodReceiveFormMapper
                .toBloodReceiveFormResponse(bloodReceiveForm);
        bloodReceiveFormResponse.setReceive_id(bloodReceiveForm.getReceive_id());
        return bloodReceiveFormResponse;
    }

    public List<BloodReceiveFormResponse> getMyBloodReceiveForm() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        List<BloodReceiveForm> list = bloodReceiveFormRepository.findAllByUserUsername(username);
        return list.stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse).toList();
    }

    public void deleteBloodReceiveForm(String id) {
        bloodReceiveFormRepository.deleteById(Integer.parseInt(id));
    }
}
