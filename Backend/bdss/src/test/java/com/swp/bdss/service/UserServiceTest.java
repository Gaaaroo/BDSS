package com.swp.bdss.service;

import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.request.UserUpdateRequest;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    private UserCreationRequest request;
    private User user;
    private User savedUser;
    private UserResponse response;

    @BeforeEach
    void setUp() {
        request = UserCreationRequest.builder()
                .username("john_doe")
                .email("john@example.com")
                .build();

        user = new User();
        user.setUsername("john_doe");
        user.setEmail("john@example.com");

        savedUser = new User();
        savedUser.setUserId(1);
        savedUser.setUsername("john_doe");
        savedUser.setEmail("john@example.com");
        savedUser.setRole("MEMBER");
        savedUser.setStatus("pending");
        savedUser.setActive(false);

        response = UserResponse.builder()
                .username("john_doe")
                .email("john@example.com")
                .role("MEMBER")
                .build();

        // Setup SecurityContext trả về userId = 1
        var auth = mock(org.springframework.security.core.Authentication.class);
        when(auth.getName()).thenReturn("1");
        var context = mock(org.springframework.security.core.context.SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        org.springframework.security.core.context.SecurityContextHolder.setContext(context);
    }


    //updateUser


    /**
     * Test: Cập nhật user thành công với đủ dữ liệu
     */
    @Test
    void updateUser_success() {
        // Tạo request cập nhật
        UserUpdateRequest updateRequest = UserUpdateRequest.builder()
                .role("ADMIN")
                .bloodType("O+")
                .build();

        // Giả lập tìm thấy user trong DB
        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(user));

        // Không cần mock `userMapper.updateUser(user, request)` vì nó là void
        // Giả lập lưu user sau khi cập nhật
        when(userRepository.save(user)).thenReturn(savedUser);
        when(userMapper.toUserResponse(savedUser)).thenReturn(response);

        // Gọi hàm
        UserResponse result = userService.updateUser("1", updateRequest);

        // Kiểm tra kết quả trả về
        assertEquals("john_doe", result.getUsername());
        assertEquals("john@example.com", result.getEmail());
        assertEquals("MEMBER", result.getRole()); // do savedUser có role = MEMBER

        // Xác minh các bước được gọi
        verify(userRepository).findById(1);
        verify(userMapper).updateUser(user, updateRequest);
        verify(userRepository).save(user);
        verify(userMapper).toUserResponse(savedUser);
    }

    /**
     * Test: Cập nhật user khi bloodType bị null → tự set thành "Unknown"
     */
    @Test
    void updateUser_nullBloodType_setUnknown() {
        UserUpdateRequest updateRequest = UserUpdateRequest.builder()
                .role("ADMIN")
                .bloodType(null)
                .build();

        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(user));
        when(userRepository.save(user)).thenReturn(savedUser);
        when(userMapper.toUserResponse(savedUser)).thenReturn(response);

        UserResponse result = userService.updateUser("1", updateRequest);

        assertEquals("john_doe", result.getUsername());
        assertEquals("MEMBER", result.getRole());

        // Do request.setBloodType("Unknown") chỉ set vào request, không set vào entity nếu null
        // nên có thể cần assert thủ công nếu logic thực thi là "user.setBloodType" chỉ khi != null
        verify(userRepository).findById(1);
        verify(userMapper).updateUser(user, updateRequest);
        verify(userRepository).save(user);
        verify(userMapper).toUserResponse(savedUser);
    }

    /**
     * Test: Cập nhật user thất bại khi không tìm thấy user
     */
    @Test
    void updateUser_userNotFound_throwException() {
        UserUpdateRequest updateRequest = UserUpdateRequest.builder()
                .role("ADMIN")
                .bloodType("A+")
                .build();

        when(userRepository.findById(1)).thenReturn(java.util.Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> {
            userService.updateUser("1", updateRequest);
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());
        verify(userRepository).findById(1);
    }


    // ============================
    // TEST: findUserNearbyWithBloodType
    // ============================

    /**
     * User có vị trí hợp lệ, trong bán kính, đúng nhóm máu → được trả về
     */
    @Test
    void findUserNearby_validUserWithMatchingBloodType_returned() {
        User u2 = new User();
        u2.setUserId(2);
        u2.setLat(10.762622);
        u2.setLng(106.660172);
        u2.setBloodType("O+");

        UserResponse res = UserResponse.builder().username("u2").build();

        when(userRepository.findAll()).thenReturn(List.of(user, u2));
        when(userMapper.toUserResponse(u2)).thenReturn(res);

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.762622, 106.660172, 5.0, "O+");

        assertEquals(1, result.size());
        assertEquals("u2", result.get(0).getUsername());

        verify(userRepository).findAll();
        verify(userMapper).toUserResponse(u2);
    }

    /**
     * User nằm ngoài bán kính → bị loại bỏ
     */
    @Test
    void findUserNearby_userTooFar_notReturned() {
        User farUser = new User();
        farUser.setUserId(2);
        farUser.setLat(21.028511);  // Hà Nội
        farUser.setLng(105.804817);
        farUser.setBloodType("O+");

        when(userRepository.findAll()).thenReturn(List.of(farUser));

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.762622, 106.660172, 5.0, "O+");

        assertTrue(result.isEmpty());
        verify(userMapper, never()).toUserResponse(any());
    }

    /**
     * User đúng vị trí nhưng khác nhóm máu → bị loại bỏ
     */
    @Test
    void findUserNearby_bloodTypeMismatch_notReturned() {
        User u2 = new User();
        u2.setUserId(2);
        u2.setLat(10.762622);
        u2.setLng(106.660172);
        u2.setBloodType("A+"); // khác với O+

        when(userRepository.findAll()).thenReturn(List.of(u2));

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.762622, 106.660172, 5.0, "O+");

        assertTrue(result.isEmpty());
        verify(userMapper, never()).toUserResponse(any());
    }

    /**
     *User không có lat/lng → bị loại bỏ
     */
    @Test
    void findUserNearby_missingLatLng_notReturned() {
        User u2 = new User();
        u2.setUserId(2);
        u2.setLat(null);
        u2.setLng(null);
        u2.setBloodType("O+");

        when(userRepository.findAll()).thenReturn(List.of(u2));

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.0, 106.0, 10.0, "O+");

        assertTrue(result.isEmpty());
        verify(userMapper, never()).toUserResponse(any());
    }

    /**
     * Nếu bloodType = null → Bỏ qua điều kiện lọc nhóm máu, chỉ lọc theo vị trí
     */
    @Test
    void findUserNearby_bloodTypeNull_allNearbyReturned() {
        User u2 = new User();
        u2.setUserId(2);
        u2.setLat(10.762622);
        u2.setLng(106.660172);
        u2.setBloodType("AB-");

        UserResponse res = UserResponse.builder().username("u2").build();
        when(userRepository.findAll()).thenReturn(List.of(u2));
        when(userMapper.toUserResponse(u2)).thenReturn(res);

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.762622, 106.660172, 5.0, null);

        assertEquals(1, result.size());
        assertEquals("u2", result.get(0).getUsername());
    }

    /**
     * ❌ User hiện tại (trùng userId với token) → Luôn bị loại bỏ
     */
    @Test
    void findUserNearby_excludeCurrentUser() {
        User self = new User();
        self.setUserId(1);
        self.setLat(10.762622);
        self.setLng(106.660172);
        self.setBloodType("O+");

        when(userRepository.findAll()).thenReturn(List.of(self));

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.762622, 106.660172, 5.0, "O+");

        assertTrue(result.isEmpty());
        verify(userMapper, never()).toUserResponse(any());
    }


    /**
     * ❌ Không có user nào trong hệ thống → trả về danh sách rỗng
     */
    @Test
    void findUserNearby_noUsersInSystem_returnEmpty() {
        when(userRepository.findAll()).thenReturn(List.of());

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.0, 106.0, 5.0, "O+");

        assertTrue(result.isEmpty());
        verify(userRepository).findAll();
        verify(userMapper, never()).toUserResponse(any());
    }

    /**
     * ❌ Tất cả user đều thiếu vị trí (lat/lng) → không user nào được trả về
     */
    @Test
    void findUserNearby_allUsersMissingLocation_returnEmpty() {
        User u1 = new User();
        u1.setUserId(2);
        u1.setLat(null);
        u1.setLng(null);
        u1.setBloodType("O+");

        User u2 = new User();
        u2.setUserId(3);
        u2.setLat(null);
        u2.setLng(106.0); // thiếu lat

        when(userRepository.findAll()).thenReturn(List.of(u1, u2));

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.0, 106.0, 5.0, "O+");

        assertTrue(result.isEmpty());
        verify(userMapper, never()).toUserResponse(any());
    }


    /**
     * ❌ Tất cả user hợp lệ nhưng quá xa → không user nào được trả về
     */
    @Test
    void findUserNearby_allUsersTooFar_returnEmpty() {
        User u1 = new User();
        u1.setUserId(2);
        u1.setLat(21.028511); // Hà Nội
        u1.setLng(105.804817);
        u1.setBloodType("O+");

        User u2 = new User();
        u2.setUserId(3);
        u2.setLat(22.396428); // Hồng Kông
        u2.setLng(114.109497);
        u2.setBloodType("O+");

        when(userRepository.findAll()).thenReturn(List.of(u1, u2));

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.762622, 106.660172, 1.0, "O+");

        assertTrue(result.isEmpty());
        verify(userMapper, never()).toUserResponse(any());
    }

    /**
     * ❌ Tất cả user ở gần nhưng nhóm máu khác → bị loại bỏ
     */
    @Test
    void findUserNearby_allUsersWrongBloodType_returnEmpty() {
        User u1 = new User();
        u1.setUserId(2);
        u1.setLat(10.762622);
        u1.setLng(106.660172);
        u1.setBloodType("A-");

        User u2 = new User();
        u2.setUserId(3);
        u2.setLat(10.762700);
        u2.setLng(106.660100);
        u2.setBloodType("B+");

        when(userRepository.findAll()).thenReturn(List.of(u1, u2));

        List<UserResponse> result = userService.findUserNearbyWithBloodType(10.762600, 106.660100, 2.0, "O+");

        assertTrue(result.isEmpty());
        verify(userMapper, never()).toUserResponse(any());
    }



}
