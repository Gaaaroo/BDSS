package com.swp.bdss.dto.request;

import com.swp.bdss.entities.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodReceiveFormCreationRequest {
    String blood_type;
    String component_type;
    int quantity;
    int volume;
    String hospital_address;
    String priority;
}
