package com.swp.bdss.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long comment_id;
    String content;
    String username;
    LocalDateTime created_at;
    int user_id;
}
