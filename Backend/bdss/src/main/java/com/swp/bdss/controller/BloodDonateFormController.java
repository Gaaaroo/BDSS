package com.swp.bdss.controller;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.service.BloodDonateFormService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("/donateForm")
@CrossOrigin("*")
public class BloodDonateFormController {
    BloodDonateFormService bloodDonateFormService;


    @PostMapping
    ApiResponse<BloodDonateFormResponse> createBloodDonateForm(@RequestBody BloodDonateFormCreationRequest request) {
        return ApiResponse.<BloodDonateFormResponse>builder()
                .code(1111)
                .data(bloodDonateFormService.createBloodDonateForm(request))
                .build();
    }
}
