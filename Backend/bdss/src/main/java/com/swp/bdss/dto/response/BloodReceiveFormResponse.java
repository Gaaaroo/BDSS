package com.swp.bdss.dto.response;

import com.swp.bdss.entities.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodReceiveFormResponse {
    int receive_id;
    User user;
    String blood_type;
    String component_type;
    int quantity;
    int volume;
    String hospital_address;
    String priority;
    LocalDate request_date;
    String status;

}
