package com.moemhub.moem.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;
    private String name;

    @Column(name = "profile_image")
    private String profileImage;
    private Integer age;
    private String gender;
    private String region;

    @ElementCollection
    @CollectionTable(name = "account_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest")
    private List<String> interests = new ArrayList<>();

    // 9) 보호자 관계 (guardian → this)
    @ManyToMany
    @JoinTable(
            name = "account_guardians",
            joinColumns = @JoinColumn(name = "ward_id"),
            inverseJoinColumns = @JoinColumn(name = "guardian_id")
    )
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Set<Account> guardians = new HashSet<>();

    // 9) 피보호자 관계 (this → ward)
    @ManyToMany(mappedBy = "guardians")
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Set<Account> wards = new HashSet<>();

}