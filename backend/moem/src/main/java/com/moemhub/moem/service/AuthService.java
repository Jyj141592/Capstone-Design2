package com.moemhub.moem.service;

import com.moemhub.moem.dto.JwtToken;
import com.moemhub.moem.dto.LoginDto;
import com.moemhub.moem.dto.RegisterDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.security.JwtTokenProvider;
import com.moemhub.moem.security.UsernamePwdAuthenticationProvider;
import com.moemhub.moem.service.FileService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationProvider authenticationProvider;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;

    public JwtToken login(LoginDto loginDto) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword());
        Authentication authenticate = authenticationProvider.authenticate(authentication);
        if (authenticate.isAuthenticated()) {
            return jwtTokenProvider.generateToken(authenticate);
        }
        return null;
    }

    public void logout() {

    }

    public String refresh(String refreshToken) {
        return jwtTokenProvider.generateByRefreshToken(refreshToken);
    }

    public boolean register(RegisterDto registerDto, MultipartFile profile) throws IOException {
        Optional<Account> account = accountRepository.findByUsername(registerDto.getUsername());
        if(account.isPresent()) return false;
        String profileImage = null;
        if(profile != null && !profile.isEmpty()){
        		profileImage = fileService.uploadProfile(profile);
        }
        try {
            String hashPwd = passwordEncoder.encode(registerDto.getPassword());
            Account newAccount = Account.builder()
                    .username(registerDto.getUsername())
                    .password(hashPwd)
                    .name(registerDto.getName())
                    .profileImage(profileImage)
                    .age(registerDto.getAge())
                    .gender(registerDto.getGender())
                    .region(registerDto.getRegion())
                    .interests(registerDto.getInterests() != null
                            ? registerDto.getInterests()
                            : List.of())
                    // ──────────────────────────────────────────────────
                    .build();
            if (registerDto.getGuardianIds() != null) {
                for (Long gid : registerDto.getGuardianIds()) {
                    Account guardian = accountRepository.findById(gid)
                            .orElseThrow(() -> new RuntimeException("Guardian not found: " + gid));
                    newAccount.getGuardians().add(guardian);
                }
            }
            Account savedAccount = accountRepository.save(newAccount);
            return savedAccount.getId() > 0;
        }
        catch(Exception e) {
            return false;
        }
    }
}
