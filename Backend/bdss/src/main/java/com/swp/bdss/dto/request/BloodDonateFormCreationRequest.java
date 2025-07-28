package com.swp.bdss.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonateFormCreationRequest {
    String healthNotes;
    LocalDateTime readyDate;
}
