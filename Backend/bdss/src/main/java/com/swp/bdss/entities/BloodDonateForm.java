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
@Table(name = "donation_request")
public class BloodDonateForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    int donate_id;
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    User user;
    String health_notes;
    String staff_notes;
    String status;
    LocalDate request_date;

}