package com.swp.bdss.service;

import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.request.UserUpdateRequest;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.User;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

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
        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);
    }

    public UserResponse getUserProfile(){
        //lấy thông tin bảo mật hiện tại
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();
        
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request){
        //an toàn hơn
        //String username = SecurityContextHolder.getContext().getAuthentication().getName();
        //User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));


        User user = userRepository.findById(Integer.parseInt(userId)).orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, request);
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setBlood_type(request.getBlood_type());
        user.setDob(request.getDob());
        user.setPhone(request.getPhone());
        user.setFull_name(request.getFull_name());

        return userMapper.toUserResponse(userRepository.save(user));

    }

}
