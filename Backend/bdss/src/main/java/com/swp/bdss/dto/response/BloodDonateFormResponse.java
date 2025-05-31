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
    String full_name;
    String health_notes;
    String status;
    LocalDate request_date;
    String staff_notes;
    //cảm giác còn thiếu trường nào đó, nhưng tạm thời để vậy
}
