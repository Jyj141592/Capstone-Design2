package com.moemhub.moem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "club_join_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship to Club entity
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    // Relationship to Account entity(applicant)
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    // Message provided by applicant for join request
    @Column(length = 500)
    private String message;

    // Status of join request (PENDING, APPROVED, REJECTED)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    // Message from admin when processing the request (e.g. rejection reason)
    @Column(length = 500)
    private String responseMessage;

    // Enum for request status
    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}