package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.request.UserUpdateRequest;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    //mapstruct tự động ánh xạ các trường có cùng tên trong request và entity -> db ko thể auto-increment
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "lat", ignore = true)
    @Mapping(target = "lng", ignore = true)
    User toUser(UserCreationRequest request);

    @Mapping(source = "userId", target = "userId")
    UserResponse toUserResponse(User user);

    @Mapping(target = "role", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
