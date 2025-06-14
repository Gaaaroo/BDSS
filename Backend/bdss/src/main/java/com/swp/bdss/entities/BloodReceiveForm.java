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
@Table(name = "receive_request")
public class BloodReceiveForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int receive_id;
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    User user;
    String blood_type;
    String component_type;
    int quantity;
    int volume;
    String hospital_address;
    String priority;
    String status;
    LocalDate request_date;
}
