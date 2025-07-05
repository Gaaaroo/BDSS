package com.swp.bdss.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "donationProcess")
public class DonationProcess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long donationProcessId;

    @Column(name = "step", nullable = false)
    int stepNumber; //12345

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "note")
    String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updatedBy", referencedColumnName = "userId")
    User updatedBy;

    @Column(name = "updatedAt", nullable = false)
    LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donateId", referencedColumnName = "donateId", nullable = false)
    @JsonIgnore
    BloodDonateForm bloodDonateForm;
}
