package com.moemhub.moem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clubs")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob
    private String description;

    @Column(name = "topic")
    private String topic;

    @Column(name = "profile_image_name")
    private String profileImageName;

    @Column(name = "region")
    private String region;

    @Builder.Default
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Lob
    @Column(name = "application_precautions", columnDefinition = "TEXT")
    private String applicationPrecautions;

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClubMember> members = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Board> boards = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "notice_board_id", referencedColumnName = "id")
    private Board noticeBoard;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "activity_board_id", referencedColumnName = "id")
    private Board activityBoard;


    public void setNoticeBoard(Board noticeBoard) {
        this.noticeBoard = noticeBoard;
        addBoard(noticeBoard);
    }

    public void setActivityBoard(Board activityBoard) {
        this.activityBoard = activityBoard;
        addBoard(activityBoard);
    }

    public void addBoard(Board board) {
        if (this.boards == null) {
            this.boards = new ArrayList<>();
        }
        this.boards.add(board);
        board.setClub(this);
    }

    public void setOwner(Account owner) {
        if (this.members == null) { this.members = new ArrayList<>(); }
        if (this.members.stream().noneMatch(m -> m.getAccount().equals(owner))) {
            ClubMember ownerMember = ClubMember.builder()
                    .club(this)
                    .account(owner)
                    .role(ClubMember.Role.OWNER)
                    .build();
            this.members.add(ownerMember);
        }
    }

    // Invite member (adds account as INVITED)
    public void inviteMember(Account account) {
        if (this.members == null) { this.members = new ArrayList<>(); }
        if (this.members.stream().noneMatch(m -> m.getAccount().equals(account))) {
            ClubMember invitedMember = ClubMember.builder()
                    .club(this)
                    .account(account)
                    .role(ClubMember.Role.INVITED)
                    .build();
            this.members.add(invitedMember);
        }
    }

    // Change member's role
    public void changeMemberRole(Account account, ClubMember.Role newRole) {
        if (this.members == null) { return; }
        for (ClubMember member : members) {
            if (member.getAccount().equals(account)) {
                member.setRole(newRole);
                break;
            }
        }
    }

    // Remove member from club
    public void removeMember(Account account) {
        if (this.members == null) { return; }
        members.removeIf(member -> member.getAccount().equals(account));
    }
}