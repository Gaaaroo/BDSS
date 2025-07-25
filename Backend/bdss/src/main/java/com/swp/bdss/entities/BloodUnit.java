package com.swp.bdss.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "bloodUnit")
public class BloodUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bloodId")
    int bloodId;

    @Column(name = "bloodType", nullable = false, length = 10)
    String bloodType;

    @Column(name = "volume", nullable = false)
    int volume;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "donatedDate", nullable = false)
    LocalDateTime donatedDate;

    @Column(name = "expiryDate", nullable = false)
    LocalDateTime expiryDate;

    @Column(name = "note", columnDefinition = "TEXT")
    String note;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donateId", referencedColumnName = "donateId")
    BloodDonateForm bloodDonateForm;

    @OneToMany(mappedBy = "bloodUnit", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<BloodComponentUnit> bloodComponentUnits;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiveId", referencedColumnName = "receiveId")
    BloodReceiveForm receiveForm;
}
