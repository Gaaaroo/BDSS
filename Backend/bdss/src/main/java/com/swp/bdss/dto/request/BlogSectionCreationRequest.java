package com.swp.bdss.dto.request;

import com.swp.bdss.entities.BlogSection;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogSectionCreationRequest {
    String content;
    String image_link;
}
