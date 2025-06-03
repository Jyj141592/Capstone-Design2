package com.moemhub.moem.service;

import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.dto.ClubUpdateDto;
import com.moemhub.moem.dto.ClubCreateDto;
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
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
@Transactional
@RequiredArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;
    private final AccountRepository accountRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ClubJoinRequestRepository joinRequestRepository;
    private final BoardRepository boardRepository;
    private final FileService fileService;

    @Override
    public Club createClub(ClubCreateDto req, MultipartFile profile,  Account owner) {
    	
    		String profileImage = null;
    		try {
	        if(profile != null && !profile.isEmpty()){
	        		profileImage = fileService.uploadProfile(profile);
	        }
    		}
    		catch(Exception ignore) {}
	    	Club club = Club.builder()
	                .name(req.getName())
	                .description(req.getDescription())
	                .topic(req.getTopic())
	                .profileImageName(profileImage)
	                .region(req.getRegion())
	                .applicationPrecautions(req.getApplicationPrecautions())
	                .build();
        // Set the club owner
        club.setOwner(owner);

        // Create and associate Notice Board
        Board noticeBoard = Board.builder()
                .name("공지")
                .description("공지 게시판입니다.")
                .club(club)
                .build();

        // Create and associate Activity Board
        Board activityBoard = Board.builder()
                .name("활동 내역")
                .description("활동 내역 게시판입니다.")
                .club(club)
                .build();

        club.setNoticeBoard(noticeBoard);
        club.setActivityBoard(activityBoard);

        return clubRepository.save(club);
    }

    @Override
    public Club updateClub(Long clubId, ClubUpdateDto updatedClub) {
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
    public void changeMemberRole(Long clubId, String username, ClubMember.Role role) {
        ClubMember member = clubMemberRepository.findByClubAndAccount(
                clubRepository.findById(clubId)
                        .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId)),
                accountRepository.findByUsername(username)
                        .orElseThrow(() -> new EntityNotFoundException("Account not found: " + username))
        ).orElseThrow(() -> new EntityNotFoundException(
                "Member not found in club " + clubId + " for account " + username
        ));

        if (member.getRole() == ClubMember.Role.OWNER) {
            throw new IllegalStateException("Cannot change the role of the club owner");
        }
        member.setRole(role);
        clubMemberRepository.save(member);
    }

    @Override
    public void removeMember(Long clubId, String username) {
        ClubMember member = clubMemberRepository.findByClubAndAccount(
                clubRepository.findById(clubId)
                        .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId)),
                accountRepository.findByUsername(username)
                        .orElseThrow(() -> new EntityNotFoundException("Account not found: " + username))
        ).orElseThrow(() -> new EntityNotFoundException(
                "Member not found in club " + clubId + " for account " + username
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
    public ClubJoinRequest requestToJoin(
            Long clubId,
            String requesterUsername,
            List<String> targetUsernames,
            String message) {

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));

        Account requester = accountRepository.findByUsername(requesterUsername)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + requesterUsername));

        ClubJoinRequest req = new ClubJoinRequest();
        HashSet<Account> wards = new HashSet<>();
        
        for (String ward : targetUsernames) {
        		Account target = accountRepository.findByUsername(ward)
                    .orElseThrow(() -> new EntityNotFoundException("User not found: " + ward));
        		if (!requester.equals(target)) {
                if (!target.getGuardians().contains(requester)) {
                    throw new IllegalStateException(
                            requesterUsername + " cannot request for " + ward);
                }
            }
        		wards.add(target);
        }
        
        req.setClub(club);
        req.setSubmitter(requester);
        req.setStatus(ClubJoinRequest.RequestStatus.PENDING);
        req.setMessage(message != null ? message : "");
        req.setWards(wards);
        
        return joinRequestRepository.save(req);
    }

    @Override
    public List<ClubJoinRequest> getRequests(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found: " + clubId));
        return joinRequestRepository.findByClubOrderByIdDesc(club);
    }

    @Override
    public ClubJoinRequest getJoinRequest(Long requestId) {
        return joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Join request not found: " + requestId));
    }

    @Override
    public ClubJoinRequest approveJoinRequest(Long requestId, String responseMessage) {
        ClubJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Join request not found: " + requestId));
        if (request.getStatus() != ClubJoinRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("Join request " + requestId + " is not pending");
        }
        request.setStatus(ClubJoinRequest.RequestStatus.APPROVED);
        request.setResponseMessage(responseMessage != null ? responseMessage : "");

        if (clubMemberRepository.findByClubAndAccount(request.getClub(), request.getSubmitter()).isEmpty()) {
            ClubMember member = ClubMember.builder()
                    .club(request.getClub())
                    .account(request.getSubmitter())
                    .role(ClubMember.Role.MEMBER)
                    .build();
            clubMemberRepository.save(member);
        }
        for (Account ward : request.getWards()) {
        		if (clubMemberRepository.findByClubAndAccount(request.getClub(), ward).isEmpty()) {
                ClubMember member = ClubMember.builder()
                        .club(request.getClub())
                        .account(ward)
                        .role(ClubMember.Role.MEMBER)
                        .build();
                clubMemberRepository.save(member);
            }
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
        request.setResponseMessage(responseMessage != null ? responseMessage : "");
        return joinRequestRepository.save(request);
    }
    
    @Override
    public List<ClubInfoDto> mainRecommendClubs(int count){
    		Pageable pageable = PageRequest.of(0, count);
    		Page<Club> page = clubRepository.findAll(pageable);
    		List<Club> clubs = page.getContent();
    		return clubs.stream().map(this::toDto).toList();
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
                .region(club.getRegion())
                .applicationPrecautions(club.getApplicationPrecautions())
                .profileImageName(club.getProfileImageName())
                .noticeBoardId(club.getNoticeBoard().getId())
                .activityBoardId(club.getActivityBoard().getId())
                .build();
    }
}