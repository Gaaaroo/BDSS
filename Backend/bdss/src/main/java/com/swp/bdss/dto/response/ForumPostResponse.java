package com.swp.bdss.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForumPostResponse {
    String postId;
    String title;
    String content;
    String username;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<CommentResponse> comments;
}
