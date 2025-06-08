package com.swp.bdss.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "blog")
public class Blog {
    @Id
    int blog_id;
    String title;
    String content;
    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id")
    User user;
    LocalDate created_date;
    String image_link;
    boolean status;
}
