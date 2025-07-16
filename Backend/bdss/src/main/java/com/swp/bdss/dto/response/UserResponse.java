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
    String userId;
    String imageLink;
    String username;
    String password;
    String gender;
    String fullName;
    LocalDate dob;
    String email;
    String phone;
    String address;
    Double lat;
    Double lng;
    String bloodType;
    String role;
    String status;
}
