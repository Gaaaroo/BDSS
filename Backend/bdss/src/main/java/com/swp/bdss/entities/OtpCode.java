package com.swp.bdss.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "otp_codes")
public class OtpCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false)
    String otpCode;
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    User user;


    @Column(name = "created_at")
    LocalDateTime createAt;
    @Column(nullable = false)
    LocalDateTime expiresAt;
}
