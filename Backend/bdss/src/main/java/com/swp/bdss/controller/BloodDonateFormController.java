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

import java.util.List;

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

    @GetMapping("/myDonateForm")
    ApiResponse<List<BloodDonateFormResponse>> getMyBloodDonateForm(){
        return ApiResponse.<List<BloodDonateFormResponse>>builder()
                .code(0001)
                .data(bloodDonateFormService.getUserBloodDonateForm())
                .build();
    }


    @DeleteMapping
    String deleteBloodDonateForm (@RequestParam String id){
        bloodDonateFormService.deleteBloodDonateForm(id);
        return "Delete successfully";
    }

    @GetMapping("/all")
    ApiResponse<List<BloodDonateFormResponse>> getAllUserBloodDonateForm() {
        return ApiResponse.<List<BloodDonateFormResponse>>builder()
                .code(1000)
                .data(bloodDonateFormService.getAllUserBloodDonateForm())
                .build();
    }

    @GetMapping
    ApiResponse<BloodDonateFormResponse> getBloodDonateFormById(@RequestParam String id){
        return ApiResponse.<BloodDonateFormResponse>builder()
                .code(0002)
                .data(bloodDonateFormService.getBloodDonateFormByDonateId(id))
                .build();
    }
}
