package com.swp.bdss.service;

import com.swp.bdss.dto.response.BloodUnitResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodUnit;
import com.swp.bdss.entities.User;
import com.swp.bdss.mapper.BloodUnitMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodUnitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BloodUnitServiceTest {

    @Mock
    private BloodUnitRepository bloodUnitRepository;

    @Mock
    private BloodUnitMapper bloodUnitMapper;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private BloodUnitService bloodUnitService;

    private BloodUnit bloodUnit;
    private BloodUnitResponse bloodUnitResponse;
    private Pageable pageable;
    private User user;
    private BloodDonateForm form;

    @BeforeEach
    void setUp() {
        // Giả lập Pageable
        pageable = PageRequest.of(0, 10, Sort.by("bloodId").descending());

        // Giả lập dữ liệu máu
        user = new User();
        user.setUserId(1);
        user.setFullName("Alice");

        form = new BloodDonateForm();
        form.setUser(user);

        bloodUnit = new BloodUnit();
        bloodUnit.setBloodId(1);
        bloodUnit.setBloodType("A+");
        bloodUnit.setStatus("Stored");
        bloodUnit.setBloodDonateForm(form);

        bloodUnitResponse = new BloodUnitResponse();
        bloodUnitResponse.setBloodId(1);
        bloodUnitResponse.setBloodType("A+");
        bloodUnitResponse.setStatus("Stored");

        UserResponse userResponse = new UserResponse();
        userResponse.setFullName("Alice");

        when(bloodUnitMapper.toBloodUnitResponse(bloodUnit)).thenReturn(bloodUnitResponse);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);
    }

    /**
     * test cho hàm getFilteredBloodUnits
     * Test: Filter theo bloodType + status + fullName
     */
    @Test
    void getFilteredBloodUnits_allFilters_success() {
        String bloodType = "A+";
        List<String> statuses = List.of("Stored");
        String fullName = "Ali";

        Page<BloodUnit> page = new PageImpl<>(List.of(bloodUnit));
        when(bloodUnitRepository.findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase(
                bloodType, statuses, fullName, pageable))
                .thenReturn(page);

        Page<BloodUnitResponse> result = bloodUnitService.getFilteredBloodUnits(
                bloodType, statuses, fullName, pageable);

        assertEquals(1, result.getContent().size());
        BloodUnitResponse response = result.getContent().get(0);
        assertEquals("A+", response.getBloodType());
        assertEquals("Stored", response.getStatus());

        verify(bloodUnitRepository).findByBloodTypeAndStatusInAndFullNameLikeIgnoreCase(
                bloodType, statuses, fullName, pageable);
        verify(bloodUnitMapper).toBloodUnitResponse(bloodUnit);
        verify(userMapper).toUserResponse(user);
    }

    //theo status
    @Test
    void getFilteredBloodUnits_onlyStatus_success() {
        List<String> statuses = List.of("Stored");

        Page<BloodUnit> page = new PageImpl<>(List.of(bloodUnit));
        when(bloodUnitRepository.findByStatusInOrderByBloodIdDesc(statuses, pageable)).thenReturn(page);

        Page<BloodUnitResponse> result = bloodUnitService.getFilteredBloodUnits(null, statuses, null, pageable);

        assertEquals(1, result.getContent().size());
        verify(bloodUnitRepository).findByStatusInOrderByBloodIdDesc(statuses, pageable);
        verify(bloodUnitMapper).toBloodUnitResponse(bloodUnit);
        verify(userMapper).toUserResponse(user);
    }

    //theo bloodType
    @Test
    void getFilteredBloodUnits_onlyBloodType_success() {
        String bloodType = "A+";

        Page<BloodUnit> page = new PageImpl<>(List.of(bloodUnit));
        when(bloodUnitRepository.findByBloodTypeOrderByBloodIdDesc(bloodType, pageable)).thenReturn(page);

        Page<BloodUnitResponse> result = bloodUnitService.getFilteredBloodUnits(bloodType, null, null, pageable);

        assertEquals(1, result.getContent().size());
        verify(bloodUnitRepository).findByBloodTypeOrderByBloodIdDesc(bloodType, pageable);
        verify(bloodUnitMapper).toBloodUnitResponse(bloodUnit);
        verify(userMapper).toUserResponse(user);
    }

    //thoe fullname
    @Test
    void getFilteredBloodUnits_onlyFullName_success() {
        String fullName = "Ali";

        Page<BloodUnit> page = new PageImpl<>(List.of(bloodUnit));
        when(bloodUnitRepository.findByFullNameLikeIgnoreCase(fullName, pageable)).thenReturn(page);

        Page<BloodUnitResponse> result = bloodUnitService.getFilteredBloodUnits(null, null, fullName, pageable);

        assertEquals(10, result.getContent().size());
        verify(bloodUnitRepository).findByFullNameLikeIgnoreCase(fullName, pageable);
        verify(bloodUnitMapper).toBloodUnitResponse(bloodUnit);
        verify(userMapper).toUserResponse(user);
    }

    @Test
    void getFilteredBloodUnits_fullNameAndBloodType_success() {
        String bloodType = "A+";
        String fullName = "Ali";

        Page<BloodUnit> page = new PageImpl<>(List.of(bloodUnit));
        when(bloodUnitRepository.findByBloodTypeAndFullNameLikeIgnoreCase(
                bloodType, fullName, pageable)).thenReturn(page);

        Page<BloodUnitResponse> result = bloodUnitService.getFilteredBloodUnits(bloodType, null, fullName, pageable);

        assertEquals(1, result.getContent().size());
        verify(bloodUnitRepository).findByBloodTypeAndFullNameLikeIgnoreCase(bloodType, fullName, pageable);
        verify(bloodUnitMapper).toBloodUnitResponse(bloodUnit);
        verify(userMapper).toUserResponse(user);
    }


    @Test
    void getFilteredBloodUnits_statusAndFullName_success() {
        List<String> statuses = List.of("Stored");
        String fullName = "Ali";

        Page<BloodUnit> page = new PageImpl<>(List.of(bloodUnit));
        when(bloodUnitRepository.findByStatusInAndFullNameLikeIgnoreCase(
                statuses, fullName, pageable)).thenReturn(page);

        Page<BloodUnitResponse> result = bloodUnitService.getFilteredBloodUnits(null, statuses, fullName, pageable);

        assertEquals(1, result.getContent().size());
        verify(bloodUnitRepository).findByStatusInAndFullNameLikeIgnoreCase(statuses, fullName, pageable);
        verify(bloodUnitMapper).toBloodUnitResponse(bloodUnit);
        verify(userMapper).toUserResponse(user);
    }



    // ko fillter
    @Test
    void getFilteredBloodUnits_noFilters_success() {
        Page<BloodUnit> page = new PageImpl<>(List.of(bloodUnit));
        when(bloodUnitRepository.findAllByOrderByBloodIdDesc(pageable)).thenReturn(page);

        Page<BloodUnitResponse> result = bloodUnitService.getFilteredBloodUnits(null, null, null, pageable);

        assertEquals(8, result.getContent().size());
        verify(bloodUnitRepository).findAllByOrderByBloodIdDesc(pageable);
        verify(bloodUnitMapper).toBloodUnitResponse(bloodUnit);
        verify(userMapper).toUserResponse(user);
    }

}
