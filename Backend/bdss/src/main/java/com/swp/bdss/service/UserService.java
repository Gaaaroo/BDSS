package com.swp.bdss.service;

import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.request.UserUpdateRequest;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.UserRepository;
//import org.springframework.security.core.context.SecurityContextHolder;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserMapper userMapper;
    UserRepository userRepository;

    public UserResponse createUser(UserCreationRequest request) {
        User user = userMapper.toUser(request);
        if (request.getBlood_type() == null) {
            request.setBlood_type("Unknown");
        } else {
            user.setBlood_type(request.getBlood_type());
        }
        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);
    }

//    public UserResponse getUserProfile(){
//        var context = SecurityContextHolder.getContext();
//        String username = context.getAuthentication().getName();
//
//        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
//        return userMapper.toUserResponse(user);
//    }

    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        //an toàn hơn
        //String username = SecurityContextHolder.getContext().getAuthentication().getName();
        //User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        User user = userRepository.findById(Integer.parseInt(userId)).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);
        var role = request.getRole();
        user.setRole(role);

        if (request.getBlood_type() == null) {
            request.setBlood_type("Unknown");
        } else {
            user.setBlood_type(request.getBlood_type());
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(Integer.parseInt(userId));
    }

}
