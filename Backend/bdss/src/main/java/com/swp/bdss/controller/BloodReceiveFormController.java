package com.swp.bdss.controller;

import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.service.BloodReceiveFormService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/receiveForm")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@CrossOrigin("*")
public class BloodReceiveFormController {
    BloodReceiveFormService bloodReceiveFormService;

    @PostMapping
    ApiResponse<BloodReceiveFormResponse> createBloodReceiveForm(@RequestBody BloodReceiveFormCreationRequest request) {
        return ApiResponse.<BloodReceiveFormResponse>builder()
                .code(1000)
                .data(bloodReceiveFormService.createBloodReceiveForm(request))
                .build();
    }
}
