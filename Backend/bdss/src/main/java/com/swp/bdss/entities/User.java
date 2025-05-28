package com.swp.bdss.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Users")
public class User {
    @Id
    int user_id;
    String username;
    String password;
    String full_name;
    String gender;
    LocalDate dob;
    String email;
    String phone;
    String address;
    String blood_type;
    String role;
    String status;
    String verify_code;
    LocalDate code_expiration;
}
