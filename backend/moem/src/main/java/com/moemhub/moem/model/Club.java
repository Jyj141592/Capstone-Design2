package com.moemhub.moem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clubs")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    // Primary key (auto-increment)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Club name (required)
    @Column(nullable = false)
    private String name;

    // Club description
    private String description;

    // Club visibility: true = public, false = private
    private boolean isPublic;

    // List of club members (OneToMany relation with ClubMember)
    @JsonIgnore
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClubMember> members = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Board> boards = new ArrayList<>();

    // Set club owner (first member as owner)
    public void setOwner(Account owner) {
        ClubMember ownerMember = ClubMember.builder()
                .club(this)
                .account(owner)
                .role(ClubMember.Role.OWNER)
                .build();
        this.members.add(ownerMember);
    }

    // Invite member (adds account as INVITED)
    public void inviteMember(Account account) {
        ClubMember invitedMember = ClubMember.builder()
                .club(this)
                .account(account)
                .role(ClubMember.Role.INVITED)
                .build();
        this.members.add(invitedMember);
    }

    // Change member's role
    public void changeMemberRole(Account account, ClubMember.Role newRole) {
        for (ClubMember member : members) {
            if (member.getAccount().equals(account)) {
                member.setRole(newRole);
                break;
            }
        }
    }

    // Remove member from club
    public void removeMember(Account account) {
        members.removeIf(member -> member.getAccount().equals(account));
    }

    // Delete club
    public void deleteClub() {
        // Remove all members
        this.members.clear();
    }
}
