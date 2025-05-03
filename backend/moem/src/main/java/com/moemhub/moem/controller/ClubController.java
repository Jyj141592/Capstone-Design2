package com.moemhub.moem.controller;

import com.moemhub.moem.dto.ClubJoinRequestDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.service.ClubService;
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

    public ClubController(ClubService clubService, AccountRepository accountRepository) {
        this.clubService = clubService;
        this.accountRepository = accountRepository;
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