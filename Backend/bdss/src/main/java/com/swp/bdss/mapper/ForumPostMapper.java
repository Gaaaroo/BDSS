package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.ForumPostCreationRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.ForumPostResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.ForumPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ForumPostMapper {
    ForumPost toForumPost(ForumPostCreationRequest request);

    @Mapping(source = "post_id", target = "post_id")
    @Mapping(source = "user.username", target = "username")
    ForumPostResponse toForumPostResponse(ForumPost forumPost);
}
