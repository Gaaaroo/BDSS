package com.swp.bdss.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodReceiveFormCreationRequest {
    String bloodType;
    String componentType;
    int quantity;
    int volume;
    String hospitalAddress;
    String priority;
//    LocalDate requiredDate;
}
