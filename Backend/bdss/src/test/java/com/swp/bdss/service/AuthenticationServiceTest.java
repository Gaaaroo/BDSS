package com.swp.bdss.service;

import com.swp.bdss.dto.request.AuthenticationRequest;
import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.request.VerifyOtpRequest;
import com.swp.bdss.dto.response.AuthenticationResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.InvalidatedTokenRepository;
import com.swp.bdss.repository.PasswordResetTokenRepository;
import com.swp.bdss.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private InvalidatedTokenRepository invalidatedTokenRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private EmailService emailService;

    @Mock
    private OtpCodeService otpCodeService;

    @Mock
    private UserService userService;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void init() {
        authenticationService.SIGNER_KEY = "SWP391/HuynhChauDucVoa/gwhOpxfAHeMMGae/o3R1n44DPt8Qfzd2/HEm+fvRF";
        authenticationService.VALID_DURATION = 3600L;         // 1 giờ
        authenticationService.REFRESHABLE_DURATION = 86400L;  // 24 giờ
    }

    // IsAuthenticated

    //UTCID01
    @Test
    void isAuthenticated_validRequest_success() {
        // GIVEN
        AuthenticationRequest request = new AuthenticationRequest("natalya", "11111");

        User user = new User();
        user.setUsername("natalya");
        user.setPassword("11111");
        user.setActive(true);

        when(userRepository.findByUsername("natalya")).thenReturn(Optional.of(user));

        // WHEN
        AuthenticationResponse response = authenticationService.isAuthenticated(request);

        // THEN
        assertTrue(response.isAuthenticated());
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
    }

    //UTCID02
    @Test
    void isAuthenticated_invalidPassword_throwsException() {
        AuthenticationRequest request = new AuthenticationRequest("user1", "wrongpass");
        User user = new User();
        user.setUsername("user1");
        user.setPassword("correctpass");
        user.setActive(true);

        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));

        AppException ex = assertThrows(AppException.class, () -> {
            authenticationService.isAuthenticated(request);
        });

        assertEquals(ErrorCode.INCORRECT_PASSWORD, ex.getErrorCode());
    }

    //UTCID03
    @Test
    void isAuthenticated_invalidUsername_throwsException() {
        // GIVEN
        AuthenticationRequest request = new AuthenticationRequest("unknownUser", "somePassword");

        // Username không tồn tại trong DB
        when(userRepository.findByUsername("unknownUser")).thenReturn(Optional.empty());

        // WHEN & THEN
        AppException ex = assertThrows(AppException.class, () -> {
            authenticationService.isAuthenticated(request);
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, ex.getErrorCode());
    }


    // registerUserAndSendOtp

    //UTCID02
    @Test
    void registerUserAndSendOtp_emailOrUsernameNotExisted_success() {
        UserCreationRequest request = new UserCreationRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");

        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userMapper.toUser(request)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(otpCodeService.saveOtpCode(user)).thenReturn("123456");
        doNothing().when(emailService).sendOtpEmail("test@example.com", "123456");

        UserResponse userResponse = UserResponse.builder()
                .email("test@example.com")
                .username("testuser")
                .build();

        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        UserResponse result = authenticationService.registerUserAndSendOtp(request);

        assertEquals("testuser", result.getUsername());
        verify(emailService).sendOtpEmail("test@example.com", "123456");
    }



    ////UTCID01
    /**
     * Test case 1:
     * Khi người dùng đăng ký với email đã tồn tại trong hệ thống
     * → Ném AppException với mã lỗi EMAIL_EXISTED
     */
    @Test
    void registerUserAndSendOtp_emailAlreadyExists_throwsAppException() {
        UserCreationRequest request = new UserCreationRequest();
        request.setEmail("test@example.com");
        request.setUsername("testuser");

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(new User()));

        AppException exception = assertThrows(AppException.class, () ->
                authenticationService.registerUserAndSendOtp(request)
        );

        assertEquals(ErrorCode.EMAIL_EXISTED, exception.getErrorCode());
    }

    //UTCID03
    /**
     * Test case 2:
     * Khi người dùng đăng ký với username đã tồn tại trong hệ thống
     * → Ném AppException với mã lỗi USERNAME_EXISTED
     */
    @Test
    void registerUserAndSendOtp_usernameAlreadyExists_throwsAppException() {
        UserCreationRequest request = new UserCreationRequest();
        request.setEmail("test@example.com");
        request.setUsername("testuser");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        //  Giả lập sai: trả về Optional.empty() → giống như username chưa tồn tại
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () ->
                authenticationService.registerUserAndSendOtp(request)
        );

        assertEquals(ErrorCode.USERNAME_EXISTED, exception.getErrorCode());
    }

    /**
     * Test case 3:
     * Mô phỏng lỗi xảy ra khi gửi email OTP (gửi thất bại)
     * → Ném RuntimeException với message tương ứng
     */
    @Test
    void registerUserAndSendOtp_sendOtpEmailFails_throwsRuntimeException() {
        UserCreationRequest request = new UserCreationRequest();
        request.setEmail("test@example.com");
        request.setUsername("testuser");

        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("testuser");

        // Không tìm thấy email và username → hợp lệ
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        // Chuyển DTO -> Entity
        when(userMapper.toUser(request)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);

        // Trả về mã OTP
        when(otpCodeService.saveOtpCode(user)).thenReturn("123456");

        // Gửi email thất bại → ném RuntimeException
        doThrow(new RuntimeException("Email failed"))
                .when(emailService).sendOtpEmail("test@example.com", "123456");

        assertThrows(RuntimeException.class, () ->
                authenticationService.registerUserAndSendOtp(request)
        );
    }

    // hàm verifyOtpAndActivateUser

    //UTCID01
    /**
     * Test case 1:
     * Khi xác thực OTP thành công → Kích hoạt tài khoản và trả về thông tin người dùng
     */
    @Test
    void verifyOtpAndActivateUser_validOtp_success() {
        VerifyOtpRequest request = new VerifyOtpRequest("test@example.com", "123456");

        User user = new User();
        user.setEmail("test@example.com");
        user.setStatus("PENDING");
        user.setActive(false);

        // Giả lập: tìm thấy user + OTP đúng
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(otpCodeService.isOtpCodeValid(user, "123456")).thenReturn(true);
        when(userRepository.save(user)).thenReturn(user);

        doNothing().when(emailService).sendWelcomeEmail("test@example.com");

        UserResponse expectedResponse = UserResponse.builder()
                .email("test@example.com")
                .build();
        when(userMapper.toUserResponse(user)).thenReturn(expectedResponse);

        UserResponse result = authenticationService.verifyOtpAndActivateUser(request);

        assertTrue(user.isActive());
        assertEquals("ACTIVE", user.getStatus());
        assertEquals("test@example.com", result.getEmail());
    }


    //UTCID03
    /**
     * Test case 2:
     * Khi email không tồn tại → ném lỗi USER_NOT_EXISTED
     */
    @Test
    void verifyOtpAndActivateUser_userNotFound_throwsAppException() {
        VerifyOtpRequest request = new VerifyOtpRequest("notfound@example.com", "123456");

        when(userRepository.findByEmail("notfound@example.com"))
                .thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () ->
                authenticationService.verifyOtpAndActivateUser(request)
        );

        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());
    }


    //UTCID02
    /**
     * Test case 3:
     * Khi mã OTP không hợp lệ → ném lỗi OTP_CODE_INVALID
     */
    @Test
    void verifyOtpAndActivateUser_invalidOtp_throwsAppException() {
        VerifyOtpRequest request = new VerifyOtpRequest("test@example.com", "000000");

        User user = new User();
        user.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(otpCodeService.isOtpCodeValid(user, "000000")).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () ->
                authenticationService.verifyOtpAndActivateUser(request)
        );

        assertEquals(ErrorCode.OTP_CODE_INVALID, exception.getErrorCode());
    }





}

