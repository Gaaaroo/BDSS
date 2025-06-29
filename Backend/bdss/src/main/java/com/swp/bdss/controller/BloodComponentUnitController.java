package com.swp.bdss.controller;

import com.swp.bdss.dto.request.BloodComponentUnitRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BloodComponentUnitResponse;
import com.swp.bdss.service.BloodComponentUnitService;
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
@RequestMapping("/bloodComponentUnit")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class BloodComponentUnitController {
    BloodComponentUnitService bloodComponentUnitService;

    // hàm này sai khi nhấn tách whole blood
    @PostMapping
    ApiResponse<String> addBloodComponentUnit (@RequestBody BloodComponentUnitRequest request){
        return ApiResponse.<String>builder()
                .code(1000)
                .data(bloodComponentUnitService.createComponentUnit(request))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<BloodComponentUnitResponse>> getAllBloodComponentUnits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodComponentUnitResponse>>builder()
                .code(1000)
                .data(bloodComponentUnitService.getAllBloodComponentUnits(pageable))
                .build();
    }

    //Khi cấp cho request thì set là Used
    @PostMapping("/updateStatus")
    public ApiResponse<String> updateBloodComponentUnitStatus(@RequestParam String status, @RequestParam int componentId) {
        return ApiResponse.<String>builder()
                .code(1000)
                .data(bloodComponentUnitService.updateBloodComponentUnitStatus(status, componentId))
                .build();
    }

    // http://localhost:8080/bdss/bloodComponentUnit/status?status=Stored&page=0&size=5
    @GetMapping("/status")
    public ApiResponse<Page<BloodComponentUnitResponse>> getAllBloodComponentUnitsByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodComponentUnitResponse>>builder()
                .code(1000)
                .data(bloodComponentUnitService.getAllBloodComponentUnitsByStatus(status, pageable))
                .build();
    }

    //http://localhost:8080/bdss/bloodComponentUnit/type-status?bloodType=A%2B&status=Stored&page=0&size=10
    @GetMapping("/type-status")
    public ApiResponse<Page<BloodComponentUnitResponse>> getAllBloodComponentUnitsByTypeAndStatus(
            @RequestParam String bloodType,
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodComponentUnitResponse>>builder()
                .code(1000)
                .data(bloodComponentUnitService.getAllBloodComponentUnitsByTypeAndStatus(bloodType, status, pageable))
                .build();
    }

    // http://localhost:8080/bdss/bloodComponentUnit/status/searchByFullName?status=Stored&fullName=cam&page=0&size=10
    @GetMapping("/status/searchByFullName")
    public ApiResponse<Page<BloodComponentUnitResponse>> filterComponentByStatusAndFullName(
            @RequestParam List<String> status,
            @RequestParam String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodComponentUnitResponse>>builder()
                .code(1000)
                .data(bloodComponentUnitService.getAllBloodComponentUnitsByStatusAndFullName(status, fullName, pageable))
                .build();
    }


    // http://localhost:8080/bdss/bloodComponentUnit/type-status/searchByFullName?bloodType=A%2B&status=Stored&fullName=long&page=0&size=10
    @GetMapping("/type-status/searchByFullName")
    public ApiResponse<Page<BloodComponentUnitResponse>> filterComponentByTypeStatusAndFullName(
            @RequestParam String bloodType,
            @RequestParam List<String> status,
            @RequestParam String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BloodComponentUnitResponse>>builder()
                .code(1000)
                .data(bloodComponentUnitService.getAllBloodComponentUnitsByTypeAndStatusAndFullName(bloodType, status, fullName, pageable))
                .build();
    }
}
