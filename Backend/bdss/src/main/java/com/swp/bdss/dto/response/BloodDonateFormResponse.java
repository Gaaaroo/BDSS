package com.swp.bdss.dto.response;

import com.swp.bdss.entities.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonateFormResponse {
    int donate_id;
    UserResponse user;
    //String full_name;
    String health_notes;
    String status;
    LocalDate request_date;
    String staff_notes;
    //cảm giác còn thiếu trường nào đó, nhưng tạm thời để vậy
}
