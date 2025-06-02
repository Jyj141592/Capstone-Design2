package com.moemhub.moem.service;

import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.dto.AccountInfoDto;
import com.moemhub.moem.dto.AccountUpdateDto;
import com.moemhub.moem.dto.ClubJoinRequestDto;
import com.moemhub.moem.repository.ClubMemberRepository;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.repository.ClubJoinRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ClubJoinRequestRepository joinRequestRepository;

    @Override
    public AccountInfoDto updateAccountInfoByUsername(String username, AccountUpdateDto dto) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found: " + username));

        if (dto.getName()         != null) account.setName(dto.getName());
        if (dto.getProfileImage() != null) account.setProfileImage(dto.getProfileImage());
        if (dto.getAge()          != null) account.setAge(dto.getAge());
        if (dto.getGender()       != null) account.setGender(dto.getGender());
        if (dto.getRegion()       != null) account.setRegion(dto.getRegion());
        if (dto.getInterests()    != null) account.setInterests(dto.getInterests());

        Account updated = accountRepository.save(account);

        return AccountInfoDto.builder()
                .id(updated.getId())
                .username(updated.getUsername())
                .name(updated.getName())
                .profileImage(updated.getProfileImage())
                .age(updated.getAge())
                .gender(updated.getGender())
                .region(updated.getRegion())
                .interests(updated.getInterests())
                .build();
    }

    @Override
    public void deleteAccountByUsername(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found: " + username));
        accountRepository.delete(account);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountInfoDto getAccountInfoByUsername(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found: " + username));

        return AccountInfoDto.builder()
                .id(account.getId())
                .username(account.getUsername())
                .name(account.getName())
                .profileImage(account.getProfileImage())
                .age(account.getAge())
                .gender(account.getGender())
                .region(account.getRegion())
                .interests(account.getInterests())
                .build();
    }

    @Override
    public AccountInfoDto addGuardian(String wardUsername, String guardianUsername) {
        Account ward = accountRepository.findByUsername(wardUsername)
                .orElseThrow(() -> new EntityNotFoundException("Ward not found: " + wardUsername));
        Account guardian = accountRepository.findByUsername(guardianUsername)
                .orElseThrow(() -> new EntityNotFoundException("Guardian not found: " + guardianUsername));

        ward.getGuardians().add(guardian);
        guardian.getWards().add(ward);
        return toDto(accountRepository.save(guardian));
        
    }
    @Override
    public AccountInfoDto addWard(String guardianUsername, String wardUsername) {
        Account ward = accountRepository.findByUsername(wardUsername)
                .orElseThrow(() -> new EntityNotFoundException("Ward not found: " + wardUsername));
        Account guardian = accountRepository.findByUsername(guardianUsername)
                .orElseThrow(() -> new EntityNotFoundException("Guardian not found: " + guardianUsername));

        ward.getGuardians().add(guardian);
        guardian.getWards().add(ward);
        return toDto(accountRepository.save(ward));
        
    }

    @Override
    public void removeGuardian(String wardUsername, String guardianUsername) {
        Account ward = accountRepository.findByUsername(wardUsername)
                .orElseThrow(() -> new EntityNotFoundException("Ward not found: " + wardUsername));
        Account guardian = accountRepository.findByUsername(guardianUsername)
                .orElseThrow(() -> new EntityNotFoundException("Guardian not found: " + guardianUsername));

        ward.getGuardians().remove(guardian);
        guardian.getWards().remove(ward);

        accountRepository.save(ward);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountInfoDto> getGuardians(String wardUsername) {
        Account ward = accountRepository.findByUsername(wardUsername)
                .orElseThrow(() -> new EntityNotFoundException("Ward not found: " + wardUsername));
        return List.copyOf(ward.getGuardians()).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountInfoDto> getWards(String guardianUsername) {
        Account guardian = accountRepository.findByUsername(guardianUsername)
                .orElseThrow(() -> new EntityNotFoundException("Guardian not found: " + guardianUsername));
        return List.copyOf(guardian.getWards()).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubInfoDto> getMyClubsByUsername(String username) {
        Account me = accountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found: " + username));

        return clubMemberRepository.findByAccount(me).stream()
                .map(membership -> {
                    Club club = membership.getClub();
                    return ClubInfoDto.builder()
                            .id(club.getId())
                            .name(club.getName())
                            .description(club.getDescription())
                            .topic(club.getTopic())
                            .profileImageName(club.getProfileImageName())
                            .noticeBoardId(club.getNoticeBoard().getId())
                            .activityBoardId(club.getActivityBoard().getId())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubJoinRequestDto.Response> getMyJoinRequests(String username) {
        Account me = accountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found: " + username));

        return joinRequestRepository.findByAccount(me).stream()
                .map(request -> {
                    ClubJoinRequestDto.Response dto = new ClubJoinRequestDto.Response();
                    dto.setId(request.getId());
                    dto.setClubId(request.getClub().getId());
                    dto.setClubName(request.getClub().getName());
                    dto.setUsername(request.getAccount().getUsername());
                    dto.setMessage(request.getMessage());
                    dto.setStatus(request.getStatus().name());
                    dto.setResponseMessage(request.getResponseMessage());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    private AccountInfoDto toDto(Account account) {
	    	return AccountInfoDto.builder()
	                .id(account.getId())
	                .username(account.getUsername())
	                .name(account.getName())
	                .profileImage(account.getProfileImage())
	                .age(account.getAge())
	                .gender(account.getGender())
	                .region(account.getRegion())
	                .interests(account.getInterests())
	                .build();
    }
}
