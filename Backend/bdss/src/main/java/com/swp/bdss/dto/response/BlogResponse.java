package com.swp.bdss.dto.response;

import com.swp.bdss.entities.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogResponse {
    int blog_id;
    String title;
    String content;
    User user;
    LocalDate created_date;
    String image_link;
    boolean status;
}
