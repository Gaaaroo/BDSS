package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.ForumPostCreationRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.ForumPostResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.ForumPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CommentMapper.class})
public interface ForumPostMapper {
    ForumPost toForumPost(ForumPostCreationRequest request);

    @Mapping(source = "postId", target = "postId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.imageLink", target = "imageLink")
    @Mapping(source = "comments", target = "comments")
    ForumPostResponse toForumPostResponse(ForumPost forumPost);
}
