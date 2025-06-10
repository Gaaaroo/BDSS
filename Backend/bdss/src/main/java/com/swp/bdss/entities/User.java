package com.swp.bdss.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    int user_id;
    String image_link;
    String username;
    String password;
    String full_name;
    String gender;
    LocalDate dob;
    String email;
    String phone;
    String address;
    Double lat;
    Double lng;
    String blood_type;
    String role;
    @Column(nullable = false)
    String status;
    boolean is_active = false;
}
