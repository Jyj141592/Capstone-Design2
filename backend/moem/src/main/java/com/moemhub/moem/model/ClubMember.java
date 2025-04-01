package com.moemhub.moem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "club_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubMember {

    // Primary key (auto-increment)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-one relation to Club
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    // Many-to-one relation to Account
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    // Member role and status in club
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Enum for club roles
    public enum Role {
        // Club owner
        OWNER,
        // Admin
        ADMIN,
        // Regular member
        MEMBER,
        // Invitation pending
        INVITED
    }
}
