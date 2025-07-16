package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodReceiveForm;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodReceiveFormMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodReceiveFormRepository;
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

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BloodReceiveFormServiceTest {

    @Mock
    private BloodReceiveFormRepository bloodReceiveFormRepository;

    @Mock
    private BloodReceiveFormMapper bloodReceiveFormMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private BloodReceiveFormService bloodReceiveFormService;

    private BloodReceiveFormCreationRequest request;
    private BloodReceiveForm form;
    private BloodReceiveFormResponse response;
    private User user;
    private Authentication authentication;
    private SecurityContext context;

    @BeforeEach
    void setUp() {
        request = new BloodReceiveFormCreationRequest();
        request.setBloodType("O+");

        form = new BloodReceiveForm();
        response = new BloodReceiveFormResponse();

        user = new User();
        user.setUserId(1);
        user.setBloodReceiveForms(new LinkedList<>());

        authentication = mock(Authentication.class);
        context = mock(SecurityContext.class);
        SecurityContextHolder.setContext(context);

        when(context.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("1");
    }

    /**
     * ✅ Test: User lần đầu đăng ký nhận máu (danh sách rỗng)
     */
    @Test
    void createBloodReceiveForm_firstTimeSuccess() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(bloodReceiveFormMapper.toBloodReceiveForm(request)).thenReturn(form);
        when(userMapper.toUserResponse(user)).thenReturn(new UserResponse());
        when(bloodReceiveFormRepository.save(any())).thenReturn(form);
        when(bloodReceiveFormMapper.toBloodReceiveFormResponse(form)).thenReturn(response);

        BloodReceiveFormResponse result = bloodReceiveFormService.createBloodReceiveForm(request);

        assertNotNull(result);
        verify(bloodReceiveFormRepository).save(form);
    }

    /**
     * ✅ Test: User được duyệt lần trước → vẫn được đăng ký lại
     */
    @Test
    void createBloodReceiveForm_lastApproved_success() {
        BloodReceiveForm lastForm = new BloodReceiveForm();
        lastForm.setStatus("APPROVED");
        user.setBloodReceiveForms(new LinkedList<>(List.of(lastForm)));

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(bloodReceiveFormMapper.toBloodReceiveForm(request)).thenReturn(form);
        when(userMapper.toUserResponse(user)).thenReturn(new UserResponse());
        when(bloodReceiveFormRepository.save(any())).thenReturn(form);
        when(bloodReceiveFormMapper.toBloodReceiveFormResponse(form)).thenReturn(response);

        BloodReceiveFormResponse result = bloodReceiveFormService.createBloodReceiveForm(request);

        assertNotNull(result);
        verify(bloodReceiveFormRepository).save(form);
    }

    /**
     * ✅ Test: User bị từ chối lần trước → vẫn được đăng ký lại
     */
    @Test
    void createBloodReceiveForm_lastRejected_success() {
        BloodReceiveForm lastForm = new BloodReceiveForm();
        lastForm.setStatus("REJECTED");
        user.setBloodReceiveForms(new LinkedList<>(List.of(lastForm)));

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(bloodReceiveFormMapper.toBloodReceiveForm(request)).thenReturn(form);
        when(userMapper.toUserResponse(user)).thenReturn(new UserResponse());
        when(bloodReceiveFormRepository.save(any())).thenReturn(form);
        when(bloodReceiveFormMapper.toBloodReceiveFormResponse(form)).thenReturn(response);

        BloodReceiveFormResponse result = bloodReceiveFormService.createBloodReceiveForm(request);

        assertNotNull(result);
        verify(bloodReceiveFormRepository).save(form);
    }

    /**
     * ❌ Test: User không đủ điều kiện (lần cuối đang PENDING) → throw
     */
    @Test
    void createBloodReceiveForm_pendingStatus_throw() {
        BloodReceiveForm lastForm = new BloodReceiveForm();
        lastForm.setStatus("PENDING");
        user.setBloodReceiveForms(new LinkedList<>(List.of(lastForm)));

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        AppException ex = assertThrows(AppException.class, () -> {
            bloodReceiveFormService.createBloodReceiveForm(request);
        });

        assertEquals(ErrorCode.NOT_ELIGIBLE_TO_REGISTER_RECEIVE, ex.getErrorCode());
    }

    /**
     * ❌ Test: Không tìm thấy user → throw
     */
    @Test
    void createBloodReceiveForm_userNotFound_throw() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> {
            bloodReceiveFormService.createBloodReceiveForm(request);
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, ex.getErrorCode());
    }




}
