package com.swp.bdss.dto.response;


import com.swp.bdss.entities.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForumPostResponse {
    String title;
    String content;
    Long user_id;
    String created_at;
    List<CommentResponse> comments;
}
