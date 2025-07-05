package com.swp.bdss.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String imageLink;
    String username;
    String password;
    String gender;
    String fullName;
    LocalDate dob;
    String email;
    Double lat;
    Double lng;
    String phone;
    String address;
    String bloodType;
    String role;
}
