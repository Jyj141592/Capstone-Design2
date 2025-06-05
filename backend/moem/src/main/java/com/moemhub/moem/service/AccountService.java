package com.moemhub.moem.service;

import com.moemhub.moem.model.Account;
import com.moemhub.moem.dto.ClubJoinRequestDto;
import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.dto.AccountInfoDto;
import com.moemhub.moem.dto.AccountUpdateDto;

import java.util.List;

public interface AccountService {

    // Update account information
    AccountInfoDto updateAccountInfoByUsername(String username, AccountUpdateDto dto);

    // Delete an account by username
    void deleteAccountByUsername(String username);

    // Retrieve account information
    AccountInfoDto getAccountInfoByUsername(String username);

    // Add a guardian to a ward
    AccountInfoDto addGuardian(String wardUsername, String guardianUsername);
    AccountInfoDto addWard(String guardianUsername, String wardUsername);
    // Remove a guardian from a ward
    void removeGuardian(String wardUsername, String guardianUsername);

    // Retrieve all guardians of a ward
    List<AccountInfoDto> getGuardians(String wardUsername);

    // Retrieve all wards of a guardian
    List<AccountInfoDto> getWards(String guardianUsername);
    List<AccountInfoDto> getWardsWithClub(Long clubId, String username);

    // Retrieve all clubs of a user
    List<ClubInfoDto> getMyClubsByUsername(String username);

    // Retrieve join requests for a user
    List<ClubJoinRequestDto.Response> getMyJoinRequests(String username);
}