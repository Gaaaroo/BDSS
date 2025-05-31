package com.swp.bdss.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonateFormCreationRequest {
    String full_name;
    String gender;
    LocalDate dob;
    String email;
    String phone;
    String address;
    String blood_type;
    String health_notes;
}
