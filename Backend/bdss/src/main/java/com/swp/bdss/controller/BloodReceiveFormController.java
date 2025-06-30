package com.swp.bdss.controller;

import com.google.protobuf.Api;
import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.request.BloodReceiveFormUpdateStatusRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.BloodResponse;
import com.swp.bdss.service.BloodReceiveFormService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RequestMapping("/receive-form")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class BloodReceiveFormController {
    BloodReceiveFormService bloodReceiveFormService;

    @PostMapping
    ApiResponse<BloodReceiveFormResponse> createBloodReceiveForm(@RequestBody BloodReceiveFormCreationRequest request) {
        return ApiResponse.<BloodReceiveFormResponse>builder()
                .code(1000)
                .data(bloodReceiveFormService.createBloodReceiveForm(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<BloodReceiveFormResponse>> getAllBloodReceiveForm () {
        return ApiResponse.<List<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getAllBloodReceiveForm())
                .build();
    }

    @GetMapping("suitable-blood")
    ApiResponse<List<BloodResponse>> getAllSuitableBloodByReceiveId ( @RequestParam int receiveId,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<List<BloodResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getAllSuitableBloodByReceiveId(receiveId, page, size))
                .build();
    }

    @GetMapping("/detail")
    ApiResponse<BloodReceiveFormResponse> getBloodReceiveFormById(@RequestParam int id) {
        return ApiResponse.<BloodReceiveFormResponse>builder()
                .code(1000)
                .data(bloodReceiveFormService.getBloodReceiveFormById(id))
                .build();
    }

    @GetMapping("/myReceiveForm")
    ApiResponse<List<BloodReceiveFormResponse>> getMyBloodReceiveForm(){
        return ApiResponse.<List<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getMyBloodReceiveForm())
                .build();
    }

    @PutMapping("/updateStatus/{id}")
    ApiResponse<BloodReceiveFormResponse> updateBloodReceiveFormStatus
            (@PathVariable("id") int id, @RequestBody BloodReceiveFormUpdateStatusRequest request){
        return ApiResponse.<BloodReceiveFormResponse>builder()
                .code(1000)
                .data(bloodReceiveFormService.updateBloodReceiveFormStatus(id, request))
                .build();
    }


    @DeleteMapping
    String deleteBloodReceiveForm (@RequestParam String id){
        bloodReceiveFormService.deleteBloodReceiveForm(id);
        return "Delete successfully";
    }

    @GetMapping("/count-by-status")
    ApiResponse<Map<String, Long>> countDonateRequestsByStatus(){
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(bloodReceiveFormService.countReceiveRequestsByStatus())
                .message("Count receive requests by status successfully")
                .build();
    }

    // Get all receive blood forms by status
    @GetMapping("/by-status")
    ApiResponse<List<BloodReceiveFormResponse>> getBloodDonateFormsByStatus(@RequestParam String status) {
        return ApiResponse.<List<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getBloodReceiveFormByStatus(status))
                .message("Get blood receive forms by status successfully")
                .build();
    }

    @GetMapping("/search")
    ApiResponse<List<BloodReceiveFormResponse>> searchBloodDonateFormByKeyword(@RequestParam String keyword){
        return ApiResponse.<List<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.searchBloodReceiveFormByKeyWord(keyword))
                .message("Search blood receive form by keyword successfully")
                .build();
    }

    @GetMapping("/by-priority")
    ApiResponse<List<BloodReceiveFormResponse>> getBloodReceiveFormWithPriority(@RequestParam String priority,
                                                                                @RequestParam(required = false) String status) {
        return ApiResponse.<List<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getBloodReceiveFormByPriorityAndOptionalStatus(priority, status))
                .message("Get blood receive forms with priority successfully")
                .build();
    }

    @GetMapping("/whole-blood")
    ApiResponse<List<BloodReceiveFormResponse>> getBloodReceiveFormByBloodTypeAndStatus(
            @RequestParam String bloodType, @RequestParam String componentType) {
        return ApiResponse.<List<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getBloodReceiveFormByBloodTypeAndComponentTypeAndStatus(bloodType, componentType))
                .message("Get blood receive forms by blood type and status successfully")
                .build();
    }

    @GetMapping("/count-request")
    public ApiResponse<Long> countBloodReceiveForm(
            @RequestParam String bloodType,
            @RequestParam String componentType
    ) {
        long count = bloodReceiveFormService.countBloodReceiveFormByBloodTypeAndComponentTypeAndStatus(bloodType, componentType);
        return ApiResponse.<Long>builder()
                .code(1000)
                .message("Count success")
                .data(count)
                .build();
    }

}
