package com.swp.bdss.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentCreationRequest {
    String content;

    @JsonProperty("post_id") // BẮT BUỘC phải có dòng này
    Long post_id;
}
