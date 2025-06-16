package com.swp.bdss.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "invalidatedTokens")
public class InvalidatedToken {
    @Id
    @Column(name = "tokenId")
    String tokenId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    User user;

    @Column(name = "expiryTime", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date expiryTime;
}