package com.swp.bdss.controller;

import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.request.UserUpdateRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.service.NotificationService;
import com.swp.bdss.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class UserController {
    UserService userService;


    @GetMapping
    public ApiResponse<Page<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<UserResponse>>builder()
                .code(1000)
                .data(userService.getUsers(keyword, pageable))
                .build();
    }


    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUserById(@PathVariable("userId") int userId) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .data(userService.getUserById(userId))
                .build();
    }

    @GetMapping("/myProfile")
    ApiResponse<UserResponse> getUserProfile(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        authentication
                .getAuthorities()
                .forEach(grantedAuthority -> log.info("Role: {}", grantedAuthority.getAuthority()));
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .data(userService.getUserProfile())
                .build();
    }

    @PutMapping("/myProfile/update")
    ApiResponse<UserResponse> updateProfile(@RequestBody UserUpdateRequest request){
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .data(userService.updateProfile(request))
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable("userId") String userId, @RequestBody UserUpdateRequest request){
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .data(userService.updateUser(userId, request))
                .build();
    }

    @GetMapping("/nearby")
    public ApiResponse<List<UserResponse>> getNearbyUser(@RequestParam double lat, @RequestParam double lng,
                                                         @RequestParam(defaultValue = "5") double radius){
        return ApiResponse.<List<UserResponse>>builder()
                .code(1000)
                .data(userService.findUserNearby(lat, lng, radius))
                .build();
    }

    @GetMapping("/nearby-with-bloodType")
    public ApiResponse<List<UserResponse>> getNearbyUser(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radius,
            @RequestParam(required = false) String bloodType) {

        return ApiResponse.<List<UserResponse>>builder()
                .code(1000)
                .data(userService.findUserNearbyWithBloodType(lat, lng, radius, bloodType))
                .build();
    }

    @PutMapping("/ban-user")
    public ApiResponse<UserResponse> banUser(@RequestParam int userId) {
        userService.banUser(userId);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("User banned successfully")
                .build();

    }

    @GetMapping("/count-all")
    public ApiResponse<Long> countAllUsers() {
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(userService.countAll())
                .message("Count of all users retrieved successfully")
                .build();
    }

    @PostMapping("/send-to-donor")
    public ApiResponse<Void> sendNotificationByUserId(@RequestParam int userId) {
        userService.sendNotiToUser(userId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Notification sent to userId " + userId)
                .build();
    }

    @PostMapping("/send-encouragement")
    public ApiResponse<String> sendEncouragementEmailByBloodType(
            @RequestParam String bloodType
    ) {
        userService.processEncouragementEmails(bloodType);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Encouragement emails sent successfully to eligible users with blood type " + bloodType)
                .build();
    }
}
