package com.moemhub.moem.controller;

import com.moemhub.moem.dto.AccountInfoDto;
import com.moemhub.moem.dto.AccountUpdateDto;
import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.dto.ClubJoinRequestDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.service.AccountService;
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
    public ResponseEntity<Void> addGuardian(
            @PathVariable String wardUsername,
            @PathVariable String guardianUsername) {

        accountService.addGuardian(wardUsername, guardianUsername);
        return ResponseEntity.ok().build();
    }

    // Remove guardian from a ward
    @DeleteMapping("/{wardUsername}/guardians/{guardianUsername}")
    public ResponseEntity<Void> removeGuardian(
            @PathVariable String wardUsername,
            @PathVariable String guardianUsername) {

        accountService.removeGuardian(wardUsername, guardianUsername);
        return ResponseEntity.noContent().build();
    }

    // Get all guardians of a ward
    @GetMapping("/{wardUsername}/guardians")
    public ResponseEntity<List<Account>> getGuardians(
            @PathVariable String wardUsername) {

        return ResponseEntity.ok(accountService.getGuardians(wardUsername));
    }

    // Get all wards of a guardian
    @GetMapping("/{guardianUsername}/wards")
    public ResponseEntity<List<Account>> getWards(
            @PathVariable String guardianUsername) {

        return ResponseEntity.ok(accountService.getWards(guardianUsername));
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
}