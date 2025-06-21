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
@Table(name = "receivingProcess")
public class ReceivingProcess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long receivingProcessId;

    @Column(name = "step", nullable = false)
    int stepNumber; //123

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
    @JoinColumn(name = "receiveId", referencedColumnName = "receiveId", nullable = false)
    @JsonIgnore
    BloodReceiveForm bloodReceiveForm;
}
