package com.swp.bdss.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateDonationProcessStepRequest {
    int donateId;
    int stepNumber;
    String note;
    String status;
}
