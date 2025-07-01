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
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // sort theo day vs volum thì thêm sort=expiryDate,asc vào url
    //hàm này dùng trong trang tổng in ra tất cả bloodUnit nhưng chỉ in ra theo status thui
    //example call api: bdss/bloodUnit/status?statuses=Stored
    @GetMapping("/status")
    public ApiResponse<Page<BloodUnitResponse>> getAllBloodUnitsByStatus(
            @RequestParam List<String> statuses,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BloodUnitResponse> result = bloodUnitService.getAllBloodUnitsByStatus(statuses, pageable);
        return ApiResponse.<Page<BloodUnitResponse>>builder()
                .code(1000)
                .data(result)
                .build();
    }

    //example call api: bdss/bloodUnit/status/searchByFullName?statuses=Stored&fullName=Cam Cam&page=0&size=10
    @GetMapping("/status/searchByFullName")
    public ApiResponse<Page<BloodUnitResponse>> filterByStatusAndUsernameFromDB(
            @RequestParam List<String> statuses,
            @RequestParam String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodUnitResponse>>builder()
                .code(1000)
                .data(bloodUnitService.getAllBloodUnitsByStatusAndFullNameDB(statuses, fullName, pageable))
                .build();
    }

    // hàm này dùng khi click vào 1 nhóm máu nào đó, vd click nhóm máu A+
    // thì show ra tất cả bloodUnit với nhóm máu O theo type nào đó (ex A+) với status nào đó lun, có thể đưa vào nhiều status
    //example call api: /bloodUnit/status-type?bloodType=A%2B&statuses=Reserved&statuses=Stored&page=0&size=10
    @GetMapping("/status-type")
    public ApiResponse<Page<BloodUnitResponse>> filterBloodUnitsByTypeAndStatus(
            @RequestParam String bloodType,
            @RequestParam List<String> statuses,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BloodUnitResponse> result = bloodUnitService.getAllBloodUnitTypeByStatus(bloodType, statuses, pageable);
        return ApiResponse.<Page<BloodUnitResponse>>builder()
                .code(1000)
                .data(result)
                .build();
    }



    //example call api: bdss/bloodUnit/status-type/searchByFullName?bloodType=A%2B&statuses=Stored&fullName=Cam&page=0&size=10
    //%2B là dấu +
    @GetMapping("/status-type/searchByFullName")
    public ApiResponse<Page<BloodUnitResponse>> filterByTypeStatusUsernameFromDB(
            @RequestParam String bloodType,
            @RequestParam List<String> statuses,
            @RequestParam String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodUnitResponse>>builder()
                .code(1000)
                .data(bloodUnitService.getAllBloodUnitTypeByStatusAndFullNameDB(bloodType, statuses, fullName, pageable))
                .build();
    }

    @GetMapping("/countBloodUnit")
    public ApiResponse<Long> countBloodUnitsByType(@RequestParam String bloodType) {
        long count = bloodUnitService.countBloodUnitsByType(bloodType);
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(count)
                .build();
    }

}
