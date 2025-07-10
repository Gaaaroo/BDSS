package com.swp.bdss.controller;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.request.BloodDonateFormUpdateStatusRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.service.BloodDonateFormService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("/donate-form")
public class BloodDonateFormController {
    BloodDonateFormService bloodDonateFormService;


    @PostMapping
    ApiResponse<BloodDonateFormResponse> createBloodDonateForm(@RequestBody BloodDonateFormCreationRequest request) {
        return ApiResponse.<BloodDonateFormResponse>builder()
                .code(1000)
                .data(bloodDonateFormService.createBloodDonateForm(request))
                .build();
    }

    @GetMapping("/myDonateForm")
    ApiResponse<List<BloodDonateFormResponse>> getMyBloodDonateForm(){
        return ApiResponse.<List<BloodDonateFormResponse>>builder()
                .code(1000)
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

    @GetMapping("/detail")
    ApiResponse<BloodDonateFormResponse> getBloodDonateFormById(@RequestParam String id){
        return ApiResponse.<BloodDonateFormResponse>builder()
                .code(1000)
                .data(bloodDonateFormService.getBloodDonateFormByDonateId(id))
                .build();
    }

    @PutMapping("/updateStatus/{id}")
    ApiResponse<BloodDonateFormResponse> updateBloodDonateFormStatus(@PathVariable("id") int id, @RequestBody BloodDonateFormUpdateStatusRequest request) {
        return ApiResponse.<BloodDonateFormResponse>builder()
                .code(1000)
                .message( "Update status successfully")
                .data(bloodDonateFormService.updateBloodDonateFormStatus(id, request))
                .build();
    }

    @GetMapping("/search")
    ApiResponse<List<BloodDonateFormResponse>> searchBloodDonateFormByKeyword(@RequestParam String keyword){
        return ApiResponse.<List<BloodDonateFormResponse>>builder()
                .code(1000)
                .data(bloodDonateFormService.searchBloodDonateFormByKeyWord(keyword))
                .message("Search blood donate form by keyword successfully")
                .build();
    }

    @GetMapping("/count-by-status")
    ApiResponse<Map<String, Long>> countDonateRequestsByStatus(){
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(bloodDonateFormService.countDonateRequestsByStatus())
                .message("Count donate requests by status successfully")
                .build();
    }

    // Get all blood donate forms by status
    @GetMapping("/by-status")
    ApiResponse<List<BloodDonateFormResponse>> getBloodDonateFormsByStatus(@RequestParam String status) {
        return ApiResponse.<List<BloodDonateFormResponse>>builder()
                .code(1000)
                .data(bloodDonateFormService.getBloodDonateFormByStatus(status))
                .message("Get blood donate forms by status successfully")
                .build();
    }

    @GetMapping("/count-requests-by-blood-type")      //count blood donate forms by blood type and status = "PENDING", "PROCESSING"
    ApiResponse<Long> countBloodDonateFormByBloodType(@RequestParam String bloodType) {
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(bloodDonateFormService.countBloodDonateFormByBloodType(bloodType))
                .message("Count blood donate forms by blood type successfully")
                .build();
    }

    @GetMapping("/count-all")       //count all blood donate forms
    ApiResponse<Long> countAllBloodDonateForm(){
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(bloodDonateFormService.countAllBloodDonateForm())
                .message("Count all blood donate forms successfully")
                .build();
    }

    @GetMapping("/count-by-today")         //count all blood donate forms by today
    ApiResponse<Long> countBloodDonateFormByRequestDate() {
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(bloodDonateFormService.countBloodDonateFormByRequestDate())
                .message("Count blood donate forms by request date successfully")
                .build();
    }

    //http://localhost:8080/bdss/donate-form/get-statistics?mode=year
    @GetMapping("/get-statistics")      //mode can be "day", "month", or "year"
    ApiResponse<Map<String, Long>> getBloodDonateFormStatistics(@RequestParam String mode) {
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(bloodDonateFormService.getRequestStatistics(mode))
                .message("Get blood donate form statistics successfully")
                .build();
    }

    //http://localhost:8080/bdss/donate-form/get-statistics-between-dates?startDate=2025-06-01&endDate=2025-07-09
    @GetMapping("/get-statistics-between-dates")    //LOCAL_DATE format: yyyy-MM-dd
    ApiResponse<Long> getBloodDonateFormStatisticsBetweenDates(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(bloodDonateFormService.countBloodDonateFormByRequestDateBetween(startDate, endDate))
                .message("Get blood donate form statistics between dates successfully")
                .build();
    }

    @GetMapping("/count-by-blood-type")     //này đếm hết ko phân biệt status
    ApiResponse<Long> countByBloodType(@RequestParam String bloodType) {
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(bloodDonateFormService.countByBloodType(bloodType))
                .message("Count blood donate forms by blood type and status successfully")
                .build();
    }

}
