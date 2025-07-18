package com.swp.bdss.controller;

import com.google.protobuf.Api;
import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.request.BloodReceiveFormUpdateStatusRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.BloodResponse;
import com.swp.bdss.service.BloodReceiveFormService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/all")
    ApiResponse<Page<BloodReceiveFormResponse>> getAllBloodReceiveForm (
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getAllBloodReceiveForm(pageable))
                .build();
    }

    @GetMapping("suitable-blood")
    public ApiResponse<Page<BloodResponse>> getAllSuitableBloodByReceiveId(
            @RequestParam int receiveId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<BloodResponse> result = bloodReceiveFormService.getAllSuitableBloodByReceiveId(receiveId, page, size);

        return ApiResponse.<Page<BloodResponse>>builder()
                .code(1000)
                .data(result)
                .message("Fetch suitable blood successfully")
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
    ApiResponse<Page<BloodReceiveFormResponse>> getBloodDonateFormsByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getBloodReceiveFormByStatus(status, pageable))
                .message("Get blood receive forms by status successfully")
                .build();
    }

    @GetMapping("/search")
    ApiResponse<Page<BloodReceiveFormResponse>> searchBloodDonateFormByKeyword(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.searchBloodReceiveFormByKeyWord(keyword, pageable, status, priority))
                .message("Search blood receive form by keyword successfully")
                .build();
    }

    @GetMapping("/by-priority")
    ApiResponse<Page<BloodReceiveFormResponse>> getBloodReceiveFormWithPriority(
            @RequestParam String priority,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodReceiveFormResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getBloodReceiveFormByPriorityAndOptionalStatus(priority, status, pageable))
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

    // TRẢ VỀ TỔNG SỐ ĐƠN Ở ĐÂY
    @GetMapping("/count-all")
    ApiResponse<Long> countAll() {
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(bloodReceiveFormService.countAll())
                .message("Count all blood receive forms by blood type and component type successfully")
                .build();
    }

    //TRẢ VỀ DANH SÁCH TỔNG SỐ ĐƠN THEO LOẠI MÁU VÀ LOẠI THÀNH PHẦN Ở ĐÂY
    @GetMapping("/list-all")
    ApiResponse<Map<String, Map<String, Long>>> listAllByBloodTypeAndComponentType() {
        return ApiResponse.<Map<String, Map<String, Long>>>builder()
                .code(1000)
                .data(bloodReceiveFormService.countAllBloodReceiveFormByBloodTypeAndComponentType())
                .message("Count all blood receive forms by blood type and component type successfully")
                .build();
    }

    // TRẢ VỀ SỐ ĐƠN ĐĂNG KÝ TRONG HÔM NAY Ở ĐÂY
    @GetMapping("/count-by-today")
    ApiResponse<Long> countAllBloodReceiveFormByToday(){
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(bloodReceiveFormService.countBloodReceiveFormByToday())
                .message("Count blood receive forms by request date successfully")
                .build();
    }

    // TRẢ VỀ SỐ LƯỢNG ĐƠN THEO NGÀY YÊU CẦU
    @GetMapping("/count-by-dates-between")
    ApiResponse<Long> countBloodReceiveFormByRequestDateBetween(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(bloodReceiveFormService.countBloodReceiveFormByRequestDateBetween(startDate, endDate))
                .message("Count blood receive forms by request date between successfully")
                .build();
    }

    // BY DAY MONTH YEAR Ở ĐÂY
    @GetMapping("/get-statistics")
    ApiResponse<Map<String, Long>> getBloodReceiveFormStatistics(@RequestParam String mode) {
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(bloodReceiveFormService.getRequestStatistics(mode))
                .message("Get blood receive form statistics successfully")
                .build();
    }

    // TRẢ VỀ DANH SÁCH TRONG NGÀY HÔM NAY Ở ĐÂY
    @GetMapping("/count-today-by-blood-type")
    ApiResponse<Map<String,Long>> countBloodDonateFormByTodayAndBloodType() {
        return ApiResponse.<Map<String,Long>>builder()
                .code(1000)
                .data(bloodReceiveFormService.countBloodTypeToday())
                .message("Count blood donate forms by today and blood type successfully")
                .build();
    }

    @GetMapping("/list-with-name")
    ApiResponse<Map<String, BloodReceiveFormService.SeekResponse>> getBloodReceiveFormWithName() {
        return ApiResponse.<Map<String, BloodReceiveFormService.SeekResponse>>builder()
                .code(1000)
                .data(bloodReceiveFormService.listFormWithName())
                .message("Get blood receive forms by name successfully")
                .build();
    }




}
