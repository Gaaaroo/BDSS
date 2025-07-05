package com.swp.bdss.controller;

import com.swp.bdss.dto.request.UpdateDonationProcessStepRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.UpdateDonationProcessStepResponse;
import com.swp.bdss.service.DonationProcessService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/donation-process")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class DonationProcessController {
    DonationProcessService donationProcessService;

    // Update donation process step
    @PutMapping("/update-step")
    ApiResponse<UpdateDonationProcessStepResponse> updateDonationProcessStep(@RequestBody UpdateDonationProcessStepRequest request){
        return ApiResponse.<UpdateDonationProcessStepResponse>builder()
                .code(1000)
                .message("Update donation process step successfully")
                .data(donationProcessService.updateDonationStep(request))
                .build();
    }

}
