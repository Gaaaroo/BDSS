package com.swp.bdss.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import jakarta.persistence.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "blogSection") // camelCase cho table name nếu cấu hình cho phép
public class BlogSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    int id;

    @Column(name = "content", columnDefinition = "TEXT")
    String content;

    @Column(name = "imageLink")
    String imageLink;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blogId", referencedColumnName = "blogId")
    Blog blog;
}
