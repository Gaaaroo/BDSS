package com.swp.bdss.controller;

import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class UserController {
    UserService userService;

    @PostMapping
    UserResponse createUser(@RequestBody UserCreationRequest request) {
        return userService.createUser(request);
    }

    @GetMapping("/myProfile")
    UserResponse getUserProfile(){
        return userService.getUserProfile();
    }
}
