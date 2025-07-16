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
import java.util.Map;

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

    @GetMapping("/filter")
    public ApiResponse<Page<BloodComponentUnitResponse>> getFilteredBloodComponentUnits(
            @RequestParam(required = false) String bloodType,
            @RequestParam(required = false) List<String> statuses,
            @RequestParam(required = false) String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BloodComponentUnitResponse> result = bloodComponentUnitService.getFilteredBloodComponentUnits(
                bloodType, statuses, fullName, pageable);

        return ApiResponse.<Page<BloodComponentUnitResponse>>builder()
                .code(1000)
                .data(result)
                .build();
    }


    // GET: /bloodComponentUnit/count/by-status
    @GetMapping("/count/by-status")
    public ApiResponse<Map<String, Long>> countComponentUnitsByStatus() {
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(bloodComponentUnitService.countBloodComponentUnitsGroupedByStatus())
                .build();
    }

    // GET: /bloodComponentUnit/count/bloodType
    @GetMapping("/count/bloodType")
    public ApiResponse<Map<String, Long>> countAllComponentUnitsByBloodType() {
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(bloodComponentUnitService.countAllComponentUnitsByBloodType())
                .build();
    }

    // GET: /bdss/bloodComponentUnit/count/by-bloodType
    @GetMapping("/count/by-bloodType")
    public ApiResponse<Map<String, Long>> countByBloodTypeWithStoredStatus() {
        return ApiResponse.<Map<String, Long>>builder()
                .code(1000)
                .data(bloodComponentUnitService.countStoredComponentUnitsByBloodType())
                .build();
    }


    @GetMapping("/count/by-bloodType-componentType")
    public ApiResponse<Map<String, Map<String, Object>>> countByBloodTypeDetails() {
        return ApiResponse.<Map<String, Map<String, Object>>>builder()
                .code(1000)
                .data(bloodComponentUnitService.countStoredComponentTypeByBloodType())
                .build();
    }
}
