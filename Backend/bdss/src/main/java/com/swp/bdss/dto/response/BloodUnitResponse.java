package com.swp.bdss.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodUnitResponse implements BloodResponse {
    int bloodId;
    String bloodType;
    int volume;
    String status;
    LocalDateTime donatedDate;
    LocalDateTime expiryDate;
    String note;
    UserResponse userResponse;
}
