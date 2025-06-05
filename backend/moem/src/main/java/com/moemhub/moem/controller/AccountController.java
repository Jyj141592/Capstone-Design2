package com.moemhub.moem.controller;

import com.moemhub.moem.dto.AccountInfoDto;
import com.moemhub.moem.dto.AccountUpdateDto;
import com.moemhub.moem.dto.ActivityHistoryDto;
import com.moemhub.moem.dto.ActivityWardHistoryDto;
import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.dto.ClubJoinRequestDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.service.AccountService;
import com.moemhub.moem.service.ActivityService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final ActivityService activityService;

    // Update account information
    @PutMapping("/info")
    public ResponseEntity<AccountInfoDto> updateMyProfile(
            Authentication authentication,
            @RequestBody AccountUpdateDto dto) {

        String username = authentication.getName();
        AccountInfoDto updated = accountService.updateAccountInfoByUsername(username, dto);
        return ResponseEntity.ok(updated);
    }

    // Delete account
    @DeleteMapping("/info")
    public ResponseEntity<Void> deleteMyAccount(Authentication authentication) {
        String username = authentication.getName();
        accountService.deleteAccountByUsername(username);
        return ResponseEntity.noContent().build();
    }

    // Retrieve account information
    @GetMapping("/info")
    public ResponseEntity<AccountInfoDto> getAccountInfo(Authentication authentication) {
        String username = authentication.getName();
        AccountInfoDto dto = accountService.getAccountInfoByUsername(username);

        return ResponseEntity.ok(dto);
    }

    // Add guardian to a ward
    @PostMapping("/{wardUsername}/guardians/{guardianUsername}")
    public ResponseEntity<AccountInfoDto> addGuardian(
            @PathVariable(name="wardUsername") String wardUsername,
            @PathVariable(name="guardianUsername") String guardianUsername) {

        var dto = accountService.addGuardian(wardUsername, guardianUsername);
        return ResponseEntity.ok(dto);
    }

    // Add ward to a guardian
    @PostMapping("/{guardianUsername}/wards/{wardUsername}")
    public ResponseEntity<AccountInfoDto> addWard(
            @PathVariable(name="guardianUsername") String guardianUsername,
            @PathVariable(name="wardUsername") String wardUsername) {

        var dto = accountService.addWard(guardianUsername, wardUsername);
        return ResponseEntity.ok(dto);
    }
    
    // Remove guardian from a ward
    @DeleteMapping("/{wardUsername}/guardians/{guardianUsername}")
    public ResponseEntity<Void> removeGuardian(
            @PathVariable(name="wardUsername") String wardUsername,
            @PathVariable(name="guardianUsername") String guardianUsername) {

        accountService.removeGuardian(wardUsername, guardianUsername);
        return ResponseEntity.noContent().build();
    }

    // Get all guardians of a ward
    @GetMapping("/{wardUsername}/guardians")
    public ResponseEntity<List<AccountInfoDto>> getGuardians(
            @PathVariable(name="wardUsername") String wardUsername) {

        return ResponseEntity.ok(accountService.getGuardians(wardUsername));
    }

    // Get all wards of a guardian
    @GetMapping("/{guardianUsername}/wards")
    public ResponseEntity<List<AccountInfoDto>> getWards(
            @PathVariable(name="guardianUsername") String guardianUsername) {

        return ResponseEntity.ok(accountService.getWards(guardianUsername));
    }
    
    @GetMapping("/wards/club/{clubId}")
    public ResponseEntity<List<AccountInfoDto>> getWardsWithClub(
            @PathVariable(name="clubId") Long clubId, Authentication authentication) {

        return ResponseEntity.ok(accountService.getWardsWithClub(clubId, authentication.getName()));
    }

    // Get all clubs of a user
    @GetMapping("/my-clubs")
    public ResponseEntity<List<ClubInfoDto>> getMyClubs(Authentication authentication) {
        String username = authentication.getName();
        List<ClubInfoDto> clubs = accountService.getMyClubsByUsername(username);
        return ResponseEntity.ok(clubs);
    }

    // Get join requests for a user
    @GetMapping("/join-requests")
    public ResponseEntity<List<ClubJoinRequestDto.Response>> getMyJoinRequests(
            Authentication authentication) {

        String username = authentication.getName();
        List<ClubJoinRequestDto.Response> requests =
                accountService.getMyJoinRequests(username);
        return ResponseEntity.ok(requests);
    }
    @GetMapping("/my-activity")
    public ResponseEntity<List<ActivityHistoryDto>> myApplications(Authentication auth) {
        return ResponseEntity.ok(activityService.getMyAppliedActivities(auth.getName()));
    }

    @GetMapping("/wards-activity")
    public ResponseEntity<List<ActivityWardHistoryDto>> wardApplications(Authentication auth) {
        return ResponseEntity.ok(activityService.getWardAppliedActivities(auth.getName()));
    }
}