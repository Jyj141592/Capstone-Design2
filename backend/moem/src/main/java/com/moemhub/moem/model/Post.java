package com.moemhub.moem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    // Primary key (auto-increment)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Post title (required)
    @Column(nullable = false)
    private String title;

    // Post content (large text)
    @Lob
    private String content;
}
