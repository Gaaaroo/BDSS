package com.swp.bdss.controller;

import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.request.UserUpdateRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .data(userService.createUser(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .code(1000)
                .data(userService.getUsers())
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

    @DeleteMapping("/{userId}")
    String deleteUser(@PathVariable("userId") String userId){
        userService.deleteUser(userId);
        return "Delete successfully";
    }


    @GetMapping("/nearby")
    public ApiResponse<List<UserResponse>> getNearbyUser(@RequestParam double lat, @RequestParam double lng,
                                                         @RequestParam(defaultValue = "5") double radius){
        return ApiResponse.<List<UserResponse>>builder()
                .code(1000)
                .data(userService.findUserNearby(lat, lng, radius))
                .build();
    }




}
