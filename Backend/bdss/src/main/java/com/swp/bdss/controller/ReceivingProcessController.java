package com.swp.bdss.controller;

import com.swp.bdss.dto.request.UpdateDonationProcessStepRequest;
import com.swp.bdss.dto.request.UpdateReceivingProcessStepRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.UpdateDonationProcessStepResponse;
import com.swp.bdss.dto.response.UpdateReceivingProcessStepResponse;
import com.swp.bdss.service.DonationProcessService;
import com.swp.bdss.service.ReceivingProcessService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/receiving-process")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class ReceivingProcessController {
    ReceivingProcessService receivingProcessService;
    // Update receiving process step
    @PutMapping("/update-step")
    ApiResponse<UpdateReceivingProcessStepResponse> updateReceivingProcessStep(@RequestBody UpdateReceivingProcessStepRequest request){
        return ApiResponse.<UpdateReceivingProcessStepResponse>builder()
                .code(1000)
                .message("Update receiving process step successfully")
                .data(receivingProcessService.updateReceivingStep(request))
                .build();
    }

}
