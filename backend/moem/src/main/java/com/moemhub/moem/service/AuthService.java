package com.moemhub.moem.service;

import com.moemhub.moem.dto.JwtToken;
import com.moemhub.moem.dto.LoginDto;
import com.moemhub.moem.dto.RegisterDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.security.JwtTokenProvider;
import com.moemhub.moem.security.UsernamePwdAuthenticationProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationProvider authenticationProvider;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

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
    public boolean register(RegisterDto registerDto) {
        Optional<Account> account = accountRepository.findByUsername(registerDto.getUsername());
        if(account.isPresent()) return false;
        try {
            String hashPwd = passwordEncoder.encode(registerDto.getPassword());
            Account newAccount = new Account(null, registerDto.getUsername(), hashPwd);
            Account savedAccount = accountRepository.save(newAccount);
            return savedAccount.getId() > 0;
        }
        catch(Exception e) {
            return false;
        }
    }
}
