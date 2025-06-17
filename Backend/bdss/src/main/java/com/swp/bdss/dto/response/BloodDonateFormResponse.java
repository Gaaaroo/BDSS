package com.swp.bdss.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonateFormResponse {
    int donateId;
    UserResponse userResponse;
    //String full_name;
    String healthNotes;
    String status;
    LocalDate requestDate;
    String staffNotes;
    //cảm giác còn thiếu trường nào đó, nhưng tạm thời để vậy
}
