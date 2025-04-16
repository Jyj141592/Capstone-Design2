package com.moemhub.moem.service;

import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.model.ClubMember;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.repository.ClubRepository;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.repository.ClubMemberRepository;
import com.moemhub.moem.repository.ClubJoinRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final AccountRepository accountRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ClubJoinRequestRepository joinRequestRepository;

    public ClubServiceImpl(ClubRepository clubRepository,
                           AccountRepository accountRepository,
                           ClubMemberRepository clubMemberRepository,
                           ClubJoinRequestRepository joinRequestRepository) {
        this.clubRepository = clubRepository;
        this.accountRepository = accountRepository;
        this.clubMemberRepository = clubMemberRepository;
        this.joinRequestRepository = joinRequestRepository;
    }

    // ----- Club Management Methods -----

    @Override
    public Club createClub(Club club) {
        // Save a new club entity to the database
        return clubRepository.save(club);
    }

    @Override
    public Club updateClub(Long id, Club updatedClub) {
        // Retrieve the existing club
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        // Update club properties
        club.setName(updatedClub.getName());
        club.setDescription(updatedClub.getDescription());
        club.setPublic(updatedClub.isPublic());
        // Save updated club entity
        return clubRepository.save(club);
    }

    @Override
    public void deleteClub(Long id) {
        // Retrieve and delete a club after cleaning up related entities if needed
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        club.deleteClub(); // Assuming this method clears associated collections (like members)
        clubRepository.delete(club);
    }

    // ----- Member Management Methods -----

    @Override
    public List<ClubMember> getClubMembers(Long clubId) {
        // Retrieve club members for the given club
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        return clubMemberRepository.findByClub(club);
    }

    @Override
    public void changeMemberRole(Long clubId, Long accountId, ClubMember.Role role) {
        // Retrieve club and member then update the member's role (excluding owner)
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        ClubMember member = clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Member not found in club"));
        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new RuntimeException("Cannot change the role of the club owner");
        }
        member.setRole(role);
        clubMemberRepository.save(member);
    }

    @Override
    public void removeMember(Long clubId, Long accountId) {
        // Remove a member from a club (cannot remove the owner)
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        ClubMember member = clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Member not found in club"));
        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new RuntimeException("Cannot remove the club owner");
        }
        clubMemberRepository.delete(member);
    }

    @Override
    public void leaveClub(Long clubId, Long accountId) {
        // Allow a member to leave the club if they are not the owner
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        ClubMember member = clubMemberRepository.findByClubAndAccount(club, account)
                .orElseThrow(() -> new RuntimeException("Member not found in club"));
        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new RuntimeException("Club owner must transfer ownership before leaving");
        }
        clubMemberRepository.delete(member);
    }

    @Override
    public ClubJoinRequest requestToJoin(Long clubId, Long accountId, String message) {
        // Retrieve the club and account entities
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Check if the user is already a club member
        if (clubMemberRepository.findByClubAndAccount(club, account).isPresent()) {
            throw new RuntimeException("User is already a member of this club");
        }
        // Check if there is already a pending join request for this user and club
        if (joinRequestRepository.existsByClubAndAccountAndStatus(club, account, ClubJoinRequest.RequestStatus.PENDING)) {
            throw new RuntimeException("User already has a pending join request");
        }
        // Only allow join requests for public clubs
        if (!club.isPublic()) {
            throw new RuntimeException("Cannot join private clubs directly");
        }

        // Create and save a new join request with status PENDING
        ClubJoinRequest request = ClubJoinRequest.builder()
                .club(club)
                .account(account)
                .message(message)
                .status(ClubJoinRequest.RequestStatus.PENDING)
                .build();
        return joinRequestRepository.save(request);
    }

    @Override
    public List<ClubJoinRequest> getPendingRequests(Long clubId) {
        // Retrieve the club
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        // Return join requests with PENDING status
        return joinRequestRepository.findByClubAndStatus(club, ClubJoinRequest.RequestStatus.PENDING);
    }

    @Override
    public ClubJoinRequest getJoinRequest(Long requestId) {
        // Return a join request by its ID
        return joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));
    }

    @Override
    public ClubJoinRequest approveJoinRequest(Long requestId, String responseMessage) {
        // Retrieve the join request
        ClubJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));
        // Verify that the request is still pending
        if (request.getStatus() != ClubJoinRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Join request is not pending");
        }
        request.setStatus(ClubJoinRequest.RequestStatus.APPROVED);
        request.setResponseMessage(responseMessage);

        // Upon approval, add the user as a club member
        ClubMember member = ClubMember.builder()
                .club(request.getClub())
                .account(request.getAccount())
                .role(ClubMember.Role.MEMBER)
                .build();
        clubMemberRepository.save(member);
        return joinRequestRepository.save(request);
    }

    @Override
    public ClubJoinRequest rejectJoinRequest(Long requestId, String responseMessage) {
        // Retrieve the join request
        ClubJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));
        // Ensure the request status is pending
        if (request.getStatus() != ClubJoinRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Join request is not pending");
        }
        request.setStatus(ClubJoinRequest.RequestStatus.REJECTED);
        request.setResponseMessage(responseMessage);
        return joinRequestRepository.save(request);
    }
}