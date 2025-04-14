package com.moemhub.moem.controller;

import com.moemhub.moem.dto.ClubDto;
import com.moemhub.moem.dto.ClubMemberDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubMember;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.service.ClubService;
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

    public ClubController(ClubService clubService, AccountRepository accountRepository) {
        this.clubService = clubService;
        this.accountRepository = accountRepository;
    }

    // Create new club
    @PostMapping
    public ResponseEntity<Club> createClub(@RequestBody Club club) {
        // Get current authenticated user from SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        // Find Account by username
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Set owner
        club.setOwner(account);

        Club createdClub = clubService.createClub(club);
        return new ResponseEntity<>(createdClub, HttpStatus.CREATED);
    }

    // Update existing club
    @PutMapping("/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @RequestBody Club club) {
        Club updatedClub = clubService.updateClub(id, club);
        return new ResponseEntity<>(updatedClub, HttpStatus.OK);
    }

    // Delete club
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Join request endpoint
    @PostMapping("/{clubId}/join")
    public ResponseEntity<?> requestToJoin(
            @PathVariable Long clubId,
            @RequestBody(required = false) ClubMemberDto.JoinRequest request) {
        // Get current authenticated user from SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Find Account by username
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        clubService.requestToJoin(clubId, account.getId());
        return ResponseEntity.ok().build();
    }

    // Approve join request endpoint
    @PostMapping("/{clubId}/members/{accountId}/approve")
    public ResponseEntity<?> approveJoinRequest(
            @PathVariable Long clubId,
            @PathVariable Long accountId) {
        // Check if current user has admin rights (additional logic needed)
        checkAdminAuthority(clubId);

        clubService.approveJoinRequest(clubId, accountId);
        return ResponseEntity.ok().build();
    }

    // Reject join request endpoint
    @PostMapping("/{clubId}/members/{accountId}/reject")
    public ResponseEntity<?> rejectJoinRequest(
            @PathVariable Long clubId,
            @PathVariable Long accountId) {
        // Check if current user has admin rights (additional logic needed)
        checkAdminAuthority(clubId);

        clubService.rejectJoinRequest(clubId, accountId);
        return ResponseEntity.ok().build();
    }

    // Change member role endpoint
    @PutMapping("/{clubId}/members/{accountId}/role")
    public ResponseEntity<?> changeMemberRole(
            @PathVariable Long clubId,
            @PathVariable Long accountId,
            @RequestBody ClubMemberDto.ChangeRoleRequest request) {
        // Check if current user has admin rights (additional logic needed)
        checkAdminAuthority(clubId);

        clubService.changeMemberRole(clubId, accountId, request.getRole());
        return ResponseEntity.ok().build();
    }

    // Remove member endpoint (admin function)
    @DeleteMapping("/{clubId}/members/{accountId}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long clubId,
            @PathVariable Long accountId) {
        // Check if current user has admin rights (additional logic needed)
        checkAdminAuthority(clubId);

        clubService.removeMember(clubId, accountId);
        return ResponseEntity.noContent().build();
    }

    // Leave club endpoint (member self-removal)
    @DeleteMapping("/{clubId}/leave")
    public ResponseEntity<?> leaveClub(@PathVariable Long clubId) {
        // Get current authenticated user from SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Find Account by username
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        clubService.leaveClub(clubId, account.getId());
        return ResponseEntity.noContent().build();
    }

    // Get club members endpoint
    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<ClubMemberDto.Response>> getClubMembers(
            @PathVariable Long clubId) {
        List<ClubMember> members = clubService.getClubMembers(clubId);
        List<ClubMemberDto.Response> response = members.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Get pending members endpoint
    @GetMapping("/{clubId}/pending")
    public ResponseEntity<List<ClubMemberDto.Response>> getPendingMembers(
            @PathVariable Long clubId) {
        // Check if current user has admin rights (additional logic needed)
        checkAdminAuthority(clubId);

        List<ClubMember> members = clubService.getPendingMembers(clubId);
        List<ClubMemberDto.Response> response = members.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Get specific member information
    @GetMapping("/{clubId}/members/{accountId}")
    public ResponseEntity<ClubMemberDto.Response> getClubMember(
            @PathVariable Long clubId,
            @PathVariable Long accountId) {
        ClubMember member = clubService.getClubMember(clubId, accountId);
        return ResponseEntity.ok(convertToDto(member));
    }

    // Admin authority check
    private void checkAdminAuthority(Long clubId) {
        // Get current authenticated user from SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Find Account by username
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find club
        Club club = clubService.getClubMembers(clubId).get(0).getClub();

        // Find member
        ClubMember member = clubService.getClubMember(clubId, account.getId());

        // Check if user is OWNER or ADMIN
        if (member.getRole() != ClubMember.Role.OWNER && member.getRole() != ClubMember.Role.ADMIN) {
            throw new RuntimeException("Insufficient permissions to manage club members");
        }
    }

    // Helper method to convert entity to DTO
    private ClubMemberDto.Response convertToDto(ClubMember member) {
        ClubMemberDto.Response dto = new ClubMemberDto.Response();
        dto.setId(member.getId());
        dto.setAccountId(member.getAccount().getId());
        dto.setUsername(member.getAccount().getUsername()); // Assuming Account has username field
        dto.setRole(member.getRole());
        return dto;
    }
}