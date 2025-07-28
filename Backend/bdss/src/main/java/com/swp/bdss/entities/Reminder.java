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
@Table(name = "reminder")
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reminderId")
    Long reminderId;

    @ManyToOne
    @JoinColumn(name = "donateId")
    BloodDonateForm bloodDonateForm;

    @Column(name = "reminderType") // 1,2,3,4 hoặc "DAY_21", "DAY_42",...
    String reminderType;

    @Column(name = "sent_at")
    LocalDateTime sentAt;
}
