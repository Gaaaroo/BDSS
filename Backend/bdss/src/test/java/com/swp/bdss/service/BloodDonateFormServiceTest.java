package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodUnit;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodDonateFormMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodDonateFormRepository;
import com.swp.bdss.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BloodDonateFormServiceTest {

    @Mock
    private BloodDonateFormRepository bloodDonateFormRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BloodDonateFormMapper bloodDonateFormMapper;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private BloodDonateFormService bloodDonateFormService;



    private BloodDonateFormCreationRequest request;
    private BloodDonateForm bloodDonateForm;
    private BloodDonateFormResponse response;
    private User user;
    private Authentication authentication;
    private SecurityContext context;

    @BeforeEach
    void setUp() {
        request = new BloodDonateFormCreationRequest();

        bloodDonateForm = new BloodDonateForm();
        response = new BloodDonateFormResponse();
        user = new User();
        user.setUserId(1);
        user.setBloodDonateForms(new LinkedList<>());

        authentication = mock(Authentication.class);
        context = mock(SecurityContext.class);
        SecurityContextHolder.setContext(context);
    }

    /**
     * Test: User lần đầu tiên hiến máu (danh sách rỗng)
     */
    @Test
    void createBloodDonateForm_firstTimeSuccess() {
        when(context.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("1");
        when(authentication.getPrincipal()).thenReturn(mock(Jwt.class));

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(bloodDonateFormMapper.toBloodDonateForm(request)).thenReturn(bloodDonateForm);
        when(userMapper.toUserResponse(user)).thenReturn(new UserResponse());
        when(bloodDonateFormRepository.save(any())).thenReturn(bloodDonateForm);
        when(bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm)).thenReturn(response);

        BloodDonateFormResponse result = bloodDonateFormService.createBloodDonateForm(request);

        assertNotNull(result);
        verify(bloodDonateFormRepository).save(bloodDonateForm);
    }

    /**
     * Test: User bị từ chối lần trước (REJECTED)
     */
    @Test
    void createBloodDonateForm_lastRejected() {
        BloodDonateForm lastForm = new BloodDonateForm();
        lastForm.setStatus("REJECTED");
        user.setBloodDonateForms(new LinkedList<>(List.of(lastForm)));

        when(context.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("1");
        when(authentication.getPrincipal()).thenReturn(mock(Jwt.class));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(bloodDonateFormMapper.toBloodDonateForm(request)).thenReturn(bloodDonateForm);
        when(userMapper.toUserResponse(user)).thenReturn(new UserResponse());
        when(bloodDonateFormRepository.save(any())).thenReturn(bloodDonateForm);
        when(bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm)).thenReturn(response);

        BloodDonateFormResponse result = bloodDonateFormService.createBloodDonateForm(request);

        assertNotNull(result);
        verify(bloodDonateFormRepository).save(bloodDonateForm);
    }

    /**
     * Test: User đủ điều kiện (hiến máu cách đây hơn 84 ngày)
     */
    @Test
    void createBloodDonateForm_eligibleAfter84Days() {
        BloodDonateForm lastForm = new BloodDonateForm();
        BloodUnit bloodUnit = new BloodUnit();
        bloodUnit.setDonatedDate(LocalDateTime.now().minusDays(100));
        lastForm.setStatus("APPROVED");
        lastForm.setBloodUnit(bloodUnit);
        user.setBloodDonateForms(new LinkedList<>(List.of(lastForm)));

        when(context.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("1");
        when(authentication.getPrincipal()).thenReturn(mock(Jwt.class));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(bloodDonateFormMapper.toBloodDonateForm(request)).thenReturn(bloodDonateForm);
        when(userMapper.toUserResponse(user)).thenReturn(new UserResponse());
        when(bloodDonateFormRepository.save(any())).thenReturn(bloodDonateForm);
        when(bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm)).thenReturn(response);

        BloodDonateFormResponse result = bloodDonateFormService.createBloodDonateForm(request);

        assertNotNull(result);
        verify(bloodDonateFormRepository).save(bloodDonateForm);
    }

    /**
     * Test: User chưa đủ 84 ngày => throw exception
     */
    @Test
    void createBloodDonateForm_lessThan84Days_throw() {
        BloodDonateForm lastForm = new BloodDonateForm();
        BloodUnit bloodUnit = new BloodUnit();
        bloodUnit.setDonatedDate(LocalDateTime.now().minusDays(40));
        lastForm.setStatus("APPROVED");
        lastForm.setBloodUnit(bloodUnit);
        user.setBloodDonateForms(new LinkedList<>(List.of(lastForm)));

        when(context.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("1");
        when(authentication.getPrincipal()).thenReturn(mock(Jwt.class));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        AppException ex = assertThrows(AppException.class, () -> {
            bloodDonateFormService.createBloodDonateForm(request);
        });

        assertEquals(ErrorCode.NOT_ELIGIBLE_TO_REGISTER_RECEIVE, ex.getErrorCode());
    }


    /**
     * Test: Không tìm thấy user => throw
     */
    @Test
    void createBloodDonateForm_userNotFound_throw() {
        when(context.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("1");
        when(authentication.getPrincipal()).thenReturn(mock(Jwt.class));
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> {
            bloodDonateFormService.createBloodDonateForm(request);
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, ex.getErrorCode());
    }

    /**
     * Test: Có form cuối nhưng thiếu BloodUnit => throw
     */
    @Test
    void createBloodDonateForm_lastFormMissingBloodUnit_throw() {
        BloodDonateForm lastForm = new BloodDonateForm();
        lastForm.setStatus("APPROVED");
        lastForm.setBloodUnit(null); // null
        user.setBloodDonateForms(new LinkedList<>(List.of(lastForm)));

        when(context.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("1");
        when(authentication.getPrincipal()).thenReturn(mock(Jwt.class));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        AppException ex = assertThrows(AppException.class, () -> {
            bloodDonateFormService.createBloodDonateForm(request);
        });

        assertEquals(ErrorCode.BLOOD_UNIT_NOT_EXIST, ex.getErrorCode());
    }
}
