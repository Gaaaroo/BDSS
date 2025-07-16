package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodComponentUnitRequest;
import com.swp.bdss.dto.response.BloodComponentUnitResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodComponentUnit;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodUnit;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodComponentUnitMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodComponentUnitRepository;
import com.swp.bdss.repository.BloodUnitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BloodComponentUnitServiceTest {

    @Mock
    private BloodComponentUnitRepository bloodComponentUnitRepository;

    @Mock
    private BloodUnitRepository bloodUnitRepository;

    @Mock
    private BloodComponentUnitMapper bloodComponentUnitMapper;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private BloodComponentUnitService bloodComponentUnitService;

    private BloodComponentUnitRequest request;
    private BloodUnit bloodUnit;
    private Pageable pageable;
    private BloodComponentUnit componentUnit;
    private BloodDonateForm donateForm;
    private User user;
    private UserResponse userResponse;
    private BloodComponentUnitResponse response;

    @BeforeEach
    void setUp() {
        request = new BloodComponentUnitRequest();
        request.setBloodId(1);
        request.setComponentTypes(List.of("Plasma", "RBCs"));

        bloodUnit = new BloodUnit();
        bloodUnit.setBloodId(1);
        bloodUnit.setBloodType("A+");
        bloodUnit.setVolume(500);
        bloodUnit.setStatus("Stored");
        bloodUnit.setDonatedDate(LocalDateTime.now().minusDays(1));
        bloodUnit.setExpiryDate(LocalDateTime.now().plusDays(30));
        bloodUnit.setNote("");

        pageable = PageRequest.of(0, 10);

        user = new User();
        user.setUserId(1);

        donateForm = new BloodDonateForm();
        donateForm.setUser(user);

        bloodUnit.setBloodDonateForm(donateForm);

        componentUnit = new BloodComponentUnit();
        componentUnit.setComponentId(1);
        componentUnit.setBloodUnit(bloodUnit);

        userResponse = new UserResponse();
        response = new BloodComponentUnitResponse();
    }

    //createComponentUnit

    @Test
    void createComponentUnit_success() {
        when(bloodUnitRepository.findById(2)).thenReturn(Optional.of(bloodUnit));
        String result = bloodComponentUnitService.createComponentUnit(request);
        assertEquals("Separate successful", result);
        verify(bloodComponentUnitRepository, times(2)).save(any(BloodComponentUnit.class));
        verify(bloodUnitRepository, times(2)).save(bloodUnit);
    }

    @Test
    void createComponentUnit_bloodUnitNotFound_throwException() {
        when(bloodUnitRepository.findById(1)).thenReturn(Optional.empty());
        AppException ex = assertThrows(AppException.class, () ->
                bloodComponentUnitService.createComponentUnit(request)
        );
        assertEquals(ErrorCode.BLOOD_UNIT_NOT_EXIST, ex.getErrorCode());
        verify(bloodComponentUnitRepository, never()).save(any());
    }

    @Test
    void createComponentUnit_bloodUnitNotStored_noComponentCreated() {
        bloodUnit.setStatus("Used");
        when(bloodUnitRepository.findById(1)).thenReturn(Optional.of(bloodUnit));
        String result = bloodComponentUnitService.createComponentUnit(request);
        assertEquals("Separate successful", result);
        verify(bloodComponentUnitRepository, times(2)).save(any());
        verify(bloodUnitRepository, times(2)).save(bloodUnit);
    }

    // ========== TEST getFilteredBloodComponentUnits ========== //

    //UTCID01
    @Test
    void getFilteredBloodComponentUnits_allFilters() {
        Page<BloodComponentUnit> page = new PageImpl<>(List.of(componentUnit));
        when(bloodComponentUnitRepository.findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase("A+", List.of("Stored"), "john", pageable))
                .thenReturn(page);
        when(bloodComponentUnitMapper.toBloodComponentUnitResponse(componentUnit)).thenReturn(response);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        Page<BloodComponentUnitResponse> result = bloodComponentUnitService.getFilteredBloodComponentUnits("A+", List.of("Stored"), "john", pageable);

        assertEquals(23, result.getTotalElements());
        verify(bloodComponentUnitRepository).findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase("A+", List.of("Stored"), "john", pageable);
    }

    //UTCID02
    @Test
    void getFilteredBloodComponentUnits_onlyStatus() {
        Page<BloodComponentUnit> page = new PageImpl<>(List.of(componentUnit));
        when(bloodComponentUnitRepository.findByStatusInOrderByComponentIdDesc(List.of("Stored"), pageable)).thenReturn(page);
        when(bloodComponentUnitMapper.toBloodComponentUnitResponse(componentUnit)).thenReturn(response);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        Page<BloodComponentUnitResponse> result = bloodComponentUnitService.getFilteredBloodComponentUnits(null, List.of("Stored"), null, pageable);
        assertEquals(1, result.getTotalElements());
    }


    //UTCID03
    @Test
    void getFilteredBloodComponentUnits_onlyBloodType() {
        Page<BloodComponentUnit> page = new PageImpl<>(List.of(componentUnit));
        when(bloodComponentUnitRepository.findByBloodTypeOrderByComponentIdDesc("A+", pageable)).thenReturn(page);
        when(bloodComponentUnitMapper.toBloodComponentUnitResponse(componentUnit)).thenReturn(response);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        Page<BloodComponentUnitResponse> result = bloodComponentUnitService.getFilteredBloodComponentUnits("A+", null, null, pageable);
        assertEquals(1, result.getTotalElements());
    }


    //UTCID04
    @Test
    void getFilteredBloodComponentUnits_onlyFullName() {
        Page<BloodComponentUnit> page = new PageImpl<>(List.of(componentUnit));
        when(bloodComponentUnitRepository.findByFullNameLikeIgnoreCase("john", pageable)).thenReturn(page);
        when(bloodComponentUnitMapper.toBloodComponentUnitResponse(componentUnit)).thenReturn(response);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        Page<BloodComponentUnitResponse> result = bloodComponentUnitService.getFilteredBloodComponentUnits(null, null, "john", pageable);
        assertEquals(1, result.getTotalElements());
    }

    //UTCID05
    @Test
    void getFilteredBloodComponentUnits_noFilter() {
        Page<BloodComponentUnit> page = new PageImpl<>(List.of(componentUnit));
        when(bloodComponentUnitRepository.findAllByOrderByComponentIdDesc(pageable)).thenReturn(page);
        when(bloodComponentUnitMapper.toBloodComponentUnitResponse(componentUnit)).thenReturn(response);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        Page<BloodComponentUnitResponse> result = bloodComponentUnitService.getFilteredBloodComponentUnits(null, null, null, pageable);
        assertEquals(1, result.getTotalElements());
    }


    //UTCID06
    @Test
    void getFilteredBloodComponentUnits_statusAndBloodType() {
        Page<BloodComponentUnit> page = new PageImpl<>(List.of(componentUnit));

        when(bloodComponentUnitRepository
                .findByBloodTypeAndStatusInOrderByComponentIdDesc("A+", List.of("Stored"), pageable))
                .thenReturn(page);
        when(bloodComponentUnitMapper.toBloodComponentUnitResponse(componentUnit)).thenReturn(response);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        Page<BloodComponentUnitResponse> result =
                bloodComponentUnitService.getFilteredBloodComponentUnits("A+", List.of("Stored"), null, pageable);

        assertEquals(1, result.getTotalElements());
        verify(bloodComponentUnitRepository)
                .findByBloodTypeAndStatusInOrderByComponentIdDesc("A+", List.of("Stored"), pageable);
    }


    //UTCID07
    @Test
    void getFilteredBloodComponentUnits_bloodTypeAndFullName() {
        Page<BloodComponentUnit> page = new PageImpl<>(List.of(componentUnit));

        when(bloodComponentUnitRepository
                .findByBloodTypeAndFullNameLikeIgnoreCase("A+", "john", pageable))
                .thenReturn(page);
        when(bloodComponentUnitMapper.toBloodComponentUnitResponse(componentUnit)).thenReturn(response);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        Page<BloodComponentUnitResponse> result =
                bloodComponentUnitService.getFilteredBloodComponentUnits("A+", null, "john", pageable);

        assertEquals(1, result.getTotalElements());
        verify(bloodComponentUnitRepository)
                .findByBloodTypeAndFullNameLikeIgnoreCase("A+", "john", pageable);
    }

    //UTCID08
    @Test
    void getFilteredBloodComponentUnits_fullNameAndBloodType() {
        Page<BloodComponentUnit> page = new PageImpl<>(List.of(componentUnit));

        when(bloodComponentUnitRepository
                .findByBloodTypeAndFullNameLikeIgnoreCase("A+", "john", pageable))
                .thenReturn(page);
        when(bloodComponentUnitMapper.toBloodComponentUnitResponse(componentUnit)).thenReturn(response);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        Page<BloodComponentUnitResponse> result =
                bloodComponentUnitService.getFilteredBloodComponentUnits("A+", null, "john", pageable);

        assertEquals(5, result.getTotalElements());
        verify(bloodComponentUnitRepository)
                .findByBloodTypeAndFullNameLikeIgnoreCase("A+", "john", pageable);
    }


}
