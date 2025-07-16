package com.swp.bdss.controller;

import com.swp.bdss.dto.request.BloodUnitRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BloodUnitResponse;
import com.swp.bdss.service.BloodUnitService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@RequestMapping("/bloodUnit")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class BloodUnitController {
    BloodUnitService bloodUnitService;

    @PostMapping
    ApiResponse<BloodUnitResponse> addBloodUnit (@RequestBody BloodUnitRequest request){
        return ApiResponse.<BloodUnitResponse>builder()
                .code(1000)
                .data(bloodUnitService.addBloodUnit(request))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<BloodUnitResponse>> getAllBloodUnits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodUnitResponse>>builder()
                .code(1000)
                .data(bloodUnitService.getAllBloodUnits(pageable))
                .build();
    }

    @GetMapping("/type")
    public ApiResponse<Page<BloodUnitResponse>> getAllBloodUnitByType(
            @RequestParam String bloodType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodUnitResponse>>builder()
                .code(1000)
                .data(bloodUnitService.getAllBloodUnitType(bloodType, pageable))
                .build();
    }

    //Khi tách blood từ whole sang component thì dùng hàm này, setStatus thành Separated
    //Khi cấp cho request thì set là Used
    @PostMapping("/updateStatus")
    public ApiResponse<String> updateBloodUnitStatus(@RequestParam String status, @RequestParam int bloodId) {
        return ApiResponse.<String>builder()
                .code(1000)
                .data(bloodUnitService.updateBloodUnitStatus(status, bloodId))
                .build();
    }

    @GetMapping("/filter")
    public ApiResponse<Page<BloodUnitResponse>> filterBloodUnits(
            @RequestParam(required = false) String bloodType,
            @RequestParam(required = false) List<String> statuses,
            @RequestParam(required = false) String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {


        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "bloodId"));

        Page<BloodUnitResponse> result = bloodUnitService.getFilteredBloodUnits(
                bloodType, statuses, fullName, pageable
        );

        return ApiResponse.<Page<BloodUnitResponse>>builder()
                .code(1000)
                .data(result)
                .build();
    }

    @GetMapping("/countBloodUnit")
    public ApiResponse<Long> countBloodUnit(@RequestParam String bloodType) {
        long count = bloodUnitService.countBloodUnitsByType(bloodType);
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(count)
                .build();
    }

    //Đếm tổng số máu trong kho
    //localhost:8080/bdss/bloodUnit/count/all
    @GetMapping("/count/all")
    public ApiResponse<Long> countAllBloodUnits() {
        long count = bloodUnitService.countAllBloodUnits();
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(count)
                .build();
    }

    //dùng cho biểu đồ cột của whole
    //localhost:8080/bdss/bloodUnit/count/by-blood-types
    @GetMapping("/count/by-blood-types")
    public ApiResponse<Map<String, Long>> countStoredBloodUnitsByAllBloodTypes() {
        Map<String, Long> counts = bloodUnitService.countStoredBloodUnitsGroupedByBloodTypeFull();
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(counts)
                .build();
    }


    //duùng cho biểu đồ tròn, in ra 3 cái status
    //localhost:8080/bdss/bloodUnit/count/by-status
    @GetMapping("/count/by-status")
    public ApiResponse<Map<String, Long>> countBloodUnitsGroupedByStatus() {
        Map<String, Long> counts = bloodUnitService.countBloodUnitsGroupedByStatus();
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(counts)
                .build();
    }

    // này để làm cái sơ đò ml nè
    @GetMapping("/count/blood-ml-whole-component")
    public ApiResponse<List<Map<String, Object>>> getBloodInventoryChartData() {
        return ApiResponse.<List<Map<String, Object>>>builder()
                .code(1000)
                .data(bloodUnitService.countBloodInventoryByTypeComponentAndVolume())
                .build();
    }

    @PostMapping("/assign")
    public ApiResponse<String> assignToReceiveForm(
            @RequestParam int bloodId,
            @RequestParam int receiveId,
            @RequestParam String componentType
    ) {
        bloodUnitService.assignToReceiveForm(bloodId, receiveId, componentType);
        return ApiResponse.<String>builder()
                .code(1000)
                .data("Assigned successfully")
                .build();
    }
}
