package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.BlogCreationRequest;
import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.request.UserUpdateRequest;
import com.swp.bdss.dto.response.BlogResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.Blog;
import com.swp.bdss.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BlogMapper {

    Blog toBlog(BlogCreationRequest request);

    @Mapping(source = "blog_id", target = "blog_id")
    BlogResponse toBlogResponse(Blog blog);

}
