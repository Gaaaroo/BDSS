package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.CommentCreationRequest;
import com.swp.bdss.dto.response.CommentResponse;
import com.swp.bdss.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment toComment(CommentCreationRequest request);

//    @Mapping(target = "user_id", ignore = true)
    @Mapping(target = "post_id", ignore = true)
    CommentResponse toCommentResponse(Comment comment);


}
