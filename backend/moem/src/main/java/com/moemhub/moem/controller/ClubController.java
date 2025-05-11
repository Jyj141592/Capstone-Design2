package com.moemhub.moem.controller;

import com.moemhub.moem.dto.ClubCreateDto;
import com.moemhub.moem.dto.ClubUpdateDto;
import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.dto.ClubJoinRequestDto;
import com.moemhub.moem.dto.ClubMemberDto;
import com.moemhub.moem.dto.BoardDto;
import com.moemhub.moem.dto.PostSummaryDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.service.ClubService;
import com.moemhub.moem.service.BoardService;
import com.moemhub.moem.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubService clubService;
    private final AccountRepository accountRepository;
    private final BoardService boardService;
    private final PostService postService;

    public ClubController(
            ClubService clubService,
            AccountRepository accountRepository,
            BoardService boardService,
            PostService postService) {
        this.clubService = clubService;
        this.accountRepository = accountRepository;
        this.boardService = boardService;
        this.postService = postService;
    }

    // Endpoint for creating a new club
    @PostMapping
    public ResponseEntity<ClubInfoDto> createClub(
            @Valid @RequestBody ClubCreateDto req,
            Authentication authentication) {

        String username = authentication.getName();
        Account owner = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Club club = Club.builder()
                .name(req.getName())
                .description(req.getDescription())
                .topic(req.getTopic())
                .profileImageName(req.getProfileImageName())
                .region(req.getRegion())
                .applicationPrecautions(req.getApplicationPrecautions())
                .build();

        Club created = clubService.createClub(club, owner);

        ClubInfoDto resp = ClubInfoDto.builder()
                .id(created.getId())
                .name(created.getName())
                .description(created.getDescription())
                .topic(created.getTopic())
                .profileImageName(created.getProfileImageName())
                .noticeBoardId(created.getNoticeBoard().getId())
                .activityBoardId(created.getActivityBoard().getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    // Endpoint for update club
    @PutMapping("/{clubId}")
    public ResponseEntity<ClubInfoDto> updateClub(
            @PathVariable Long clubId,
            @Valid @RequestBody ClubUpdateDto req) {

        Club toUpdate = Club.builder()
                .name(req.getName())
                .description(req.getDescription())
                .topic(req.getTopic())
                .profileImageName(req.getProfileImageName())
                .region(req.getRegion())
                .applicationPrecautions(req.getApplicationPrecautions())
                .build();

        Club updated = clubService.updateClub(clubId, toUpdate);

        ClubInfoDto resp = ClubInfoDto.builder()
                .id(updated.getId())
                .name(updated.getName())
                .description(updated.getDescription())
                .topic(updated.getTopic())
                .profileImageName(updated.getProfileImageName())
                .noticeBoardId(updated.getNoticeBoard().getId())
                .activityBoardId(updated.getActivityBoard().getId())
                .build();

        return ResponseEntity.ok(resp);
    }

    // Endpoint for deleting a club
    @DeleteMapping("/{clubId}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long clubId) {
        clubService.deleteClub(clubId);
        return ResponseEntity.noContent().build();
    }

    // Endpoint for retrieving club info
    @GetMapping("/{clubId}")
    public ResponseEntity<ClubInfoDto> getClubInfo(@PathVariable Long clubId) {
        Club club = clubService.getClubById(clubId);
        ClubInfoDto dto = ClubInfoDto.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .topic(club.getTopic())
                .profileImageName(club.getProfileImageName())
                .noticeBoardId(club.getNoticeBoard().getId())
                .activityBoardId(club.getActivityBoard().getId())
                .build();
        return ResponseEntity.ok(dto);
    }

    // Change member role
    @PutMapping("/{clubId}/members/{accountId}/role")
    public ResponseEntity<Void> ChangeMemberRole(
            @PathVariable Long clubId,
            @PathVariable Long accountId,
            @Valid @RequestBody ClubMemberDto.ChangeRoleRequest req) {

        clubService.changeMemberRole(clubId, accountId, req.getRole());
        return ResponseEntity.ok().build();
    }

    // Remove member from club
    @DeleteMapping("/{clubId}/members/{accountId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long clubId,
            @PathVariable Long accountId) {

        clubService.removeMember(clubId, accountId);
        return ResponseEntity.noContent().build();
    }

    // Leave from club
    @DeleteMapping("/{clubId}/members/me")
    public ResponseEntity<Void> leaveClub(
            @PathVariable Long clubId,
            Authentication authentication) {

        String username = authentication.getName();
        Account me = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        clubService.leaveClub(clubId, me.getId());
        return ResponseEntity.noContent().build();
    }

    // Endpoint for creating join request
    @PostMapping("/{clubId}/join-requests")
    public ResponseEntity<ClubJoinRequestDto.Response> requestToJoin(
            @PathVariable Long clubId,
            @RequestBody(required = false) ClubJoinRequestDto.Request requestDto) {

        // Retrieve authenticated user's username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use provided join request message or empty string if not provided
        String message = (requestDto != null && requestDto.getMessage() != null) ? requestDto.getMessage() : "";
        ClubJoinRequest joinRequest = clubService.requestToJoin(clubId, account.getId(), message);
        return ResponseEntity.ok(convertToResponseDto(joinRequest));
    }

    // Endpoint for retrieving pending join requests for a club
    @GetMapping("/{clubId}/join-requests")
    public ResponseEntity<List<ClubJoinRequestDto.Response>> getPendingRequests(
            @PathVariable Long clubId) {
        List<ClubJoinRequest> requests = clubService.getPendingRequests(clubId);
        List<ClubJoinRequestDto.Response> response = requests.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Endpoint for join request (approve/reject)
    @PutMapping("/join-requests/{requestId}")
    public ResponseEntity<ClubJoinRequestDto.Response> processJoinRequest(
            @PathVariable Long requestId,
            @RequestBody ClubJoinRequestDto.ProcessRequest processRequest) {
        ClubJoinRequest processedRequest;
        if (processRequest.getApprove()) {
            processedRequest = clubService.approveJoinRequest(requestId, processRequest.getResponseMessage());
        } else {
            processedRequest = clubService.rejectJoinRequest(requestId, processRequest.getResponseMessage());
        }
        return ResponseEntity.ok(convertToResponseDto(processedRequest));
    }

    // Endpoint for join request instead
    @PostMapping("/{clubId}/wards/{wardId}/join-requests")
    public ResponseEntity<ClubJoinRequestDto.Response> requestJoinInstead(
            @PathVariable Long clubId,
            @PathVariable Long wardId,
            @RequestBody(required = false) ClubJoinRequestDto.Request requestDto,
            Authentication authentication) {

        String guardianUsername = authentication.getName();
        Account guardian = accountRepository.findByUsername(guardianUsername)
                .orElseThrow(() -> new RuntimeException("Guardian not found: " + guardianUsername));

        String message = (requestDto != null && requestDto.getMessage() != null)
                ? requestDto.getMessage()
                : "";

        ClubJoinRequest joinRequest = clubService.requestToJoinInstead(
                clubId, wardId, guardian.getId(), message);

        return ResponseEntity.ok(convertToResponseDto(joinRequest));
    }

    @GetMapping("/recommend/interests")
    public ResponseEntity<List<ClubInfoDto>> recommendByInterests(Authentication authentication) {
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<ClubInfoDto> recommendations =
                clubService.recommendClubsByInterests(account.getId());
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommend/region")
    public ResponseEntity<List<ClubInfoDto>> recommendByRegion(Authentication authentication) {
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<ClubInfoDto> recommendations =
                clubService.recommendClubsByRegion(account.getId());
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClubInfoDto>> searchClubs(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<String> topics,
            @RequestParam(required = false) String region) {
        List<ClubInfoDto> clubs = clubService.searchClubs(name, topics, region);
        return ResponseEntity.ok(clubs);
    }

    // Endpoint for retrieving club boards
    @GetMapping("/{clubId}/boards")
    public ResponseEntity<List<BoardDto>> listBoards(
            @PathVariable Long clubId) {

        List<BoardDto> boards = boardService.listBoard(clubId);
        return ResponseEntity.ok(boards);
    }

    // Convert ClubJoinRequest entity to DTO response form
    private ClubJoinRequestDto.Response convertToResponseDto(ClubJoinRequest request) {
        ClubJoinRequestDto.Response dto = new ClubJoinRequestDto.Response();
        dto.setId(request.getId());
        dto.setClubId(request.getClub().getId());
        dto.setClubName(request.getClub().getName());
        dto.setUsername(request.getAccount().getUsername());
        dto.setMessage(request.getMessage());
        dto.setStatus(request.getStatus().name());
        dto.setResponseMessage(request.getResponseMessage());
        return dto;
    }
}