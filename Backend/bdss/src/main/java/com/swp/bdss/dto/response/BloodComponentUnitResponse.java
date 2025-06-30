package com.swp.bdss.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodComponentUnitResponse implements BloodResponse{
    int componentId;
    String bloodType;
    String componentType;
    int volume;
    String status;
    LocalDateTime createdDate;
    LocalDateTime expiryDate;
    String note;
    UserResponse userResponse;
}
