package com.swp.bdss.dto.response;

import com.swp.bdss.dto.request.BlogSectionCreationRequest;
import com.swp.bdss.entities.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogResponse {
    int blog_id;
    String title;
    List<BlogSectionCreationRequest> sections;
    User user;
    LocalDate created_date;
    String image_link;
    boolean status;
}
