package com.moemhub.moem.model;

import java.util.*;

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
    @JoinColumn(name = "submitter", nullable = false)
    private Account submitter;
    
    @ManyToMany
    @JoinTable(
    		name="join_request_ward",
    		joinColumns = @JoinColumn(name="ward_id"),
    		inverseJoinColumns = @JoinColumn(name="req_id"))
    @ToString.Exclude @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<Account> wards = new HashSet<>();

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