package com.swp.bdss.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blog_id")
    int blog_id;
    String title;
    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id")
    User user;
    LocalDate created_date;
    String image_link;
    boolean status;
    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlogSection> sections = new ArrayList<>();
}
