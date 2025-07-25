package com.swp.bdss.entities;

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
@Table(name = "bloodComponentUnit")
public class BloodComponentUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "componentId")
    int componentId;

    @Column(name = "bloodType", nullable = false, length = 10)
    String bloodType;

    @Column(name = "componentType", nullable = false, length = 10)
    String componentType;

    @Column(name = "volume", nullable = false)
    int volume;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "donatedDate", nullable = false)
    LocalDateTime createdDate;

    @Column(name = "expiryDate", nullable = false)
    LocalDateTime expiryDate;

    @Column(name = "note", columnDefinition = "TEXT")
    String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bloodID", referencedColumnName = "bloodId", nullable = false)
    BloodUnit bloodUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiveId", referencedColumnName = "receiveId")
    BloodReceiveForm bloodReceiveForm;
}
