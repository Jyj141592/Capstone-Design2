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
    void addGuardian(String wardUsername, String guardianUsername);

    // Remove a guardian from a ward
    void removeGuardian(String wardUsername, String guardianUsername);

    // Retrieve all guardians of a ward
    List<Account> getGuardians(String wardUsername);

    // Retrieve all wards of a guardian
    List<Account> getWards(String guardianUsername);

    // Retrieve all clubs of a user
    List<ClubInfoDto> getMyClubsByUsername(String username);

    // Retrieve join requests for a user
    List<ClubJoinRequestDto.Response> getMyJoinRequests(String username);
}