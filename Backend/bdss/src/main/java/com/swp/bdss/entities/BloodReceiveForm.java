package com.swp.bdss.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "receiveRequest") // dùng camelCase cho table name luôn nếu muốn nhất quán
public class BloodReceiveForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receiveId")
    int receiveId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    User user;

    @Column(name = "bloodType", nullable = false, length = 5)
    String bloodType;

    @Column(name = "componentType", nullable = false)
    String componentType;

    @Column(name = "quantity", nullable = false)
    int quantity;

    @Column(name = "volume", nullable = false)
    int volume;

    @Column(name = "hospitalAddress", nullable = false)
    String hospitalAddress;

    @Column(name = "priority", nullable = false)
    String priority;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "requestDate", nullable = false)
    LocalDateTime requestDate;

    @OneToMany(mappedBy = "bloodReceiveForm", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ReceivingProcess> steps = new ArrayList<>();

    @OneToMany(mappedBy = "receiveForm", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<BloodUnit> bloodUnits;
}