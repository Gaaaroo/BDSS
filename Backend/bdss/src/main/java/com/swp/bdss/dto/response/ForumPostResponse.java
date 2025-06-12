package com.swp.bdss.dto.response;


import com.swp.bdss.entities.User;
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
    String post_id;
    String title;
    String content;
    String username;
    LocalDateTime created_at;
    LocalDateTime updated_at;
    List<CommentResponse> comments;
}
