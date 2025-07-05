package com.swp.bdss.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

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
    @Column(name = "userId")
    int userId;

    @Column(name = "imageLink")
    String imageLink;

    @Column(name = "username", unique = true, nullable = false, length = 50)
    String username;

    @Column(name = "password", nullable = true, length = 255)
    String password;

    @Column(name = "fullName", length = 100)
    String fullName;

    @Column(name = "gender", length = 10)
    String gender;

    @Column(name = "dob")
    LocalDate dob;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    String email;


    @Column(name = "phone", length = 20, nullable = true)
    String phone;

    @Column(name = "address", length = 255)
    String address;

    @Column(name = "lat")
    Double lat;

    @Column(name = "lng")
    Double lng;

    @Column(name = "bloodType", length = 10)
    String bloodType;

    @Column(name = "role", length = 10, nullable = false)
    String role;

    @Column(name = "status", length = 10, nullable = false)
    String status;

    @Column(name = "isActive", nullable = false)
    boolean isActive = false;

    // OneToMany relationships

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Blog> blogs;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<BloodDonateForm> bloodDonateForms;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<BloodReceiveForm> bloodReceiveForms;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Comment> comments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ForumPost> forumPosts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<InvalidatedToken> invalidatedTokens;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OtpCode> otpCodes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PasswordResetToken> passwordResetTokens;
}
