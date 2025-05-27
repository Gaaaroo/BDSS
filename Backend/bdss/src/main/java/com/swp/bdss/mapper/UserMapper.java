package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
}
