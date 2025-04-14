package com.moemhub.moem.service;

import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubMember;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.repository.ClubMemberRepository;
import com.moemhub.moem.repository.ClubRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final AccountRepository accountRepository;
    private final ClubMemberRepository clubMemberRepository;

    public ClubServiceImpl(ClubRepository clubRepository,
                           AccountRepository accountRepository,
                           ClubMemberRepository clubMemberRepository) {
        this.clubRepository = clubRepository;
        this.accountRepository = accountRepository;
        this.clubMemberRepository = clubMemberRepository;
    }

    @Override
    public Club createClub(Club club) {
        // Save new club entity
        return clubRepository.save(club);
    }

    @Override
    public Club updateClub(Long id, Club updatedClub) {
        // Find club by id or throw exception if not found
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        // Update club fields
        club.setName(updatedClub.getName());
        club.setDescription(updatedClub.getDescription());
        club.setPublic(updatedClub.isPublic());
        // Save updated club
        return clubRepository.save(club);
    }

    @Override
    public void deleteClub(Long id) {
        // Find club by id or throw exception if not found
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        // Cleanup before deletion(Clear memeber list)
        club.deleteClub();
        // Delete club entity
        clubRepository.delete(club);
    }

    @Override
    public void requestToJoin(Long clubId, Long accountId) {
        // Find club and account entities
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Check if the user is already a member or has a pending request
        if (clubMemberRepository.findByClubAndAccount(club, account).isPresent()) {
            throw new RuntimeException("Already a member or request is pending");
        }

        // Only allow join requests for public clubs
        if (!club.isPublic()) {
            throw new RuntimeException("Cannot join private clubs directly");
        }

        // Create join request with INVITED status (represents pending request)
        ClubMember member = ClubMember.builder()
                .club(club)
                .account(account)
                .role(ClubMember.Role.INVITED) // INVITED status represents pending request
                .build();

        clubMemberRepository.save(member);
    }

    @Override
    public void approveJoinRequest(Long clubId, Long accountId) {
        // Find club and account entities
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Find the join request
        ClubMember member = clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        // Validate that this is a pending request
        if (member.getRole() != ClubMember.Role.INVITED) {
            throw new RuntimeException("Not a pending join request");
        }

        // Promote to regular member
        member.setRole(ClubMember.Role.MEMBER);
        clubMemberRepository.save(member);
    }

    @Override
    public void rejectJoinRequest(Long clubId, Long accountId) {
        // Find club and account entities
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Find the join request
        ClubMember member = clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        // Validate that this is a pending request
        if (member.getRole() != ClubMember.Role.INVITED) {
            throw new RuntimeException("Not a pending join request");
        }

        // Remove the request
        clubMemberRepository.delete(member);
    }

    @Override
    public void changeMemberRole(Long clubId, Long accountId, ClubMember.Role role) {
        // Find club and account entities
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Find the member
        ClubMember member = clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Not a member of this club"));

        // Cannot change OWNER role
        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new RuntimeException("Cannot change the role of club owner");
        }

        // Use the changeMemberRole method from Club model
        club.changeMemberRole(account, role);
        clubRepository.save(club);
    }

    @Override
    public void removeMember(Long clubId, Long accountId) {
        // Find club and account entities
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Find the member
        ClubMember member = clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Not a member of this club"));

        // Cannot remove club owner
        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new RuntimeException("Cannot remove the club owner");
        }

        // Use the removeMember method from Club model
        club.removeMember(account);
        clubRepository.save(club);
    }

    @Override
    public void leaveClub(Long clubId, Long accountId) {
        // Find club and account entities
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Find the member
        ClubMember member = clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Not a member of this club"));

        // Club owner cannot leave without transferring ownership
        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new RuntimeException("Club owner must transfer ownership before leaving");
        }

        // Remove the member
        clubMemberRepository.delete(member);
    }

    @Override
    public List<ClubMember> getClubMembers(Long clubId) {
        // Find the club
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        // Return all members of the club
        return clubMemberRepository.findByClub(club);
    }

    @Override
    public List<ClubMember> getPendingMembers(Long clubId) {
        // Find the club
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        // Return only members with INVITED status
        return clubMemberRepository.findByClubAndRole(club, ClubMember.Role.INVITED);
    }

    @Override
    public ClubMember getClubMember(Long clubId, Long accountId) {
        // Find club and account entities
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Return the membership information
        return clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Not a member of this club"));
    }
}