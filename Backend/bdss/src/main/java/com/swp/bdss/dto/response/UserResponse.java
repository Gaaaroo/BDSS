package com.swp.bdss.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String image_link;
    String username;
    String password;
    String gender;
    String full_name;
    LocalDate dob;
    String email;
    String phone;
    String address;
    Double lat;
    Double lng;
    String blood_type;
    String role;
}
