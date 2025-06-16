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
@Table(name = "donationRequest") // camelCase cho table name (nếu dùng PhysicalNamingStrategyStandardImpl)
public class BloodDonateForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donateId")
    int donateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    User user;

    @Column(name = "healthNotes", columnDefinition = "TEXT")
    String healthNotes;

    @Column(name = "staffNotes", columnDefinition = "TEXT")
    String staffNotes;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "requestDate", nullable = false)
    LocalDate requestDate;
}