package com.moemhub.moem.service;

import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.model.Board;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.ClubMember;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.repository.BoardRepository;
import com.moemhub.moem.repository.ClubRepository;
import com.moemhub.moem.repository.ClubMemberRepository;
import com.moemhub.moem.repository.ClubJoinRequestRepository;
import com.moemhub.moem.repository.AccountRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final AccountRepository accountRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ClubJoinRequestRepository joinRequestRepository;
    private final BoardRepository boardRepository;

    @Override
    public Club createClub(Club club, Account owner) {
        // Set the club owner
        club.setOwner(owner);

        // Create and associate Notice Board
        Board noticeBoard = Board.builder()
                .name("공지 게시판")
                .description("공지사항을 확인하는 게시판입니다.")
                .club(club)
                .build();

        // Create and associate Activity Board
        Board activityBoard = Board.builder()
                .name("활동 내역 게시판")
                .description("활동 내역을 공유하는 게시판입니다.")
                .club(club)
                .build();

        club.setNoticeBoard(noticeBoard);
        club.setActivityBoard(activityBoard);

        return clubRepository.save(club);
    }

    @Override
    public Club updateClub(Long clubId, Club updatedClub) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));

        club.setName(updatedClub.getName());
        club.setDescription(updatedClub.getDescription());
        club.setTopic(updatedClub.getTopic());
        club.setProfileImageName(updatedClub.getProfileImageName());
        club.setRegion(updatedClub.getRegion());
        club.setApplicationPrecautions(updatedClub.getApplicationPrecautions());

        return clubRepository.save(club);
    }

    @Override
    public void deleteClub(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));
        clubRepository.delete(club);
    }

    @Override
    @Transactional(readOnly = true)
    public Club getClubById(Long clubId) {
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));
    }

    @Override
    public List<ClubMember> getClubMembers(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));
        return clubMemberRepository.findByClub(club);
    }

    @Override
    public void changeMemberRole(Long clubId, Long accountId, ClubMember.Role role) {
        ClubMember member = clubMemberRepository.findByClubAndAccount(
                clubRepository.findById(clubId)
                        .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId)),
                accountRepository.findById(accountId)
                        .orElseThrow(() -> new EntityNotFoundException("Account not found: " + accountId))
        ).orElseThrow(() -> new EntityNotFoundException(
                "Member not found in club " + clubId + " for account " + accountId
        ));

        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new IllegalStateException("Cannot change the role of the club owner");
        }
        member.setRole(role);
        clubMemberRepository.save(member);
    }

    @Override
    public void removeMember(Long clubId, Long accountId) {
        ClubMember member = clubMemberRepository.findByClubAndAccount(
                clubRepository.findById(clubId)
                        .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId)),
                accountRepository.findById(accountId)
                        .orElseThrow(() -> new EntityNotFoundException("Account not found: " + accountId))
        ).orElseThrow(() -> new EntityNotFoundException(
                "Member not found in club " + clubId + " for account " + accountId
        ));

        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new IllegalStateException("Cannot remove the club owner");
        }
        clubMemberRepository.delete(member);
    }

    @Override
    public void leaveClub(Long clubId, Long accountId) {
        ClubMember member = clubMemberRepository.findByClubAndAccount(
                clubRepository.findById(clubId)
                        .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId)),
                accountRepository.findById(accountId)
                        .orElseThrow(() -> new EntityNotFoundException("Account not found: " + accountId))
        ).orElseThrow(() -> new EntityNotFoundException(
                "Member not found in club " + clubId + " for account " + accountId
        ));

        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new IllegalStateException("Club owner must transfer ownership before leaving");
        }
        clubMemberRepository.delete(member);
    }

    @Override
    public ClubJoinRequest requestToJoin(Long clubId, Long accountId, String message) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));

        if (clubMemberRepository.findByClubAndAccount(club,
                accountRepository.findById(accountId)
                        .orElseThrow(() -> new EntityNotFoundException("Account not found: " + accountId))
        ).isPresent()) {
            throw new IllegalStateException("User " + accountId + " is already a member of club " + clubId);
        }
        if (joinRequestRepository.existsByClubAndAccountAndStatus(
                club,
                accountRepository.findById(accountId)
                        .orElseThrow(() -> new EntityNotFoundException("Account not found: " + accountId)),
                ClubJoinRequest.RequestStatus.PENDING)) {
            throw new IllegalStateException("User " + accountId + " already has a pending join request for club " + clubId);
        }

        ClubJoinRequest request = ClubJoinRequest.builder()
                .club(club)
                .account(accountRepository.findById(accountId)
                        .orElseThrow(() -> new EntityNotFoundException("Account not found: " + accountId)))
                .message(message)
                .status(ClubJoinRequest.RequestStatus.PENDING)
                .build();
        return joinRequestRepository.save(request);
    }

    @Override
    public List<ClubJoinRequest> getPendingRequests(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));
        return joinRequestRepository.findByClubAndStatus(club, ClubJoinRequest.RequestStatus.PENDING);
    }

    @Override
    public ClubJoinRequest getJoinRequest(Long requestId) {
        return joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Join request not found: " + requestId));
    }

    @Override
    public ClubJoinRequest requestToJoinInstead(Long clubId, Long wardId, Long guardianId, String message) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));
        Account ward = accountRepository.findById(wardId)
                .orElseThrow(() -> new EntityNotFoundException("Ward not found: " + wardId));
        Account guardian = accountRepository.findById(guardianId)
                .orElseThrow(() -> new EntityNotFoundException("Guardian not found: " + guardianId));

        if(!ward.getGuardians().contains(guardian)) {
            throw new IllegalStateException("Guardian " + guardianId + " is not a guardian of ward " + wardId);
        }

        if(clubMemberRepository.findByClubAndAccount(club, ward).isPresent()) {
            throw new IllegalStateException("Ward " + wardId + " is already a member of club " + clubId);
        }

        boolean pendingRequestExists = joinRequestRepository.existsByClubAndAccountAndStatus(
                club, ward, ClubJoinRequest.RequestStatus.PENDING);
        if(pendingRequestExists) {
            throw new IllegalStateException("Ward " + wardId + " already has a pending join request for club " + clubId);
        }

        ClubJoinRequest request = ClubJoinRequest.builder()
                .club(club)
                .account(ward)
                .message(message)
                .status(ClubJoinRequest.RequestStatus.PENDING)
                .build();
        return joinRequestRepository.save(request);
    }

    @Override
    public ClubJoinRequest approveJoinRequest(Long requestId, String responseMessage) {
        ClubJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Join request not found: " + requestId));
        if (request.getStatus() != ClubJoinRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("Join request " + requestId + " is not pending");
        }
        request.setStatus(ClubJoinRequest.RequestStatus.APPROVED);
        request.setResponseMessage(responseMessage);

        if (clubMemberRepository.findByClubAndAccount(request.getClub(), request.getAccount()).isEmpty()) {
            ClubMember member = ClubMember.builder()
                    .club(request.getClub())
                    .account(request.getAccount())
                    .role(ClubMember.Role.MEMBER)
                    .build();
            clubMemberRepository.save(member);
        }
        return joinRequestRepository.save(request);
    }

    @Override
    public ClubJoinRequest rejectJoinRequest(Long requestId, String responseMessage) {
        ClubJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Join request not found: " + requestId));
        if (request.getStatus() != ClubJoinRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("Join request " + requestId + " is not pending");
        }
        request.setStatus(ClubJoinRequest.RequestStatus.REJECTED);
        request.setResponseMessage(responseMessage);
        return joinRequestRepository.save(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubInfoDto> recommendClubsByInterests(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found: " + accountId));

        List<String> topics = account.getInterests();
        if(topics == null || topics.isEmpty()) {
            return List.of();
        }

        List<Club> matchedClubs = clubRepository.findByTopicIn(topics);

        Set<Long> joinedClubIds = clubMemberRepository.findByAccount(account)
                .stream()
                .map(clubMember -> clubMember.getClub().getId())
                .collect(Collectors.toSet());

        return matchedClubs.stream()
                .filter(club -> !joinedClubIds.contains(club.getId()))
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubInfoDto> recommendClubsByRegion(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found: " + accountId));

        String region = account.getRegion();
        if (region == null || region.isEmpty()) {
            return List.of();
        }

        List<Club> matchedClubs = clubRepository.findByRegion(region);

        Set<Long> joinedClubIds = clubMemberRepository.findByAccount(account)
                .stream()
                .map(clubMember -> clubMember.getClub().getId())
                .collect(Collectors.toSet());

        return matchedClubs.stream()
                .filter(club -> !joinedClubIds.contains(club.getId()))
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubInfoDto> searchClubs(String name, List<String> topics, String region) {
        if (topics != null && topics.isEmpty()) {
            topics = null;
        }

        List<Club> clubs = clubRepository.searchByNameAndTopicsAndRegion(name, topics, region);
        return clubs.stream()
                .map(this::toDto)
                .toList();
    }

    private ClubInfoDto toDto(Club club) {
        return ClubInfoDto.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .topic(club.getTopic())
                .profileImageName(club.getProfileImageName())
                .noticeBoardId(club.getNoticeBoard().getId())
                .activityBoardId(club.getActivityBoard().getId())
                .build();
    }
}