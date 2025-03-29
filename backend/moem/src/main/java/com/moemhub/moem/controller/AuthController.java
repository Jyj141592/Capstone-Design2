package com.moemhub.moem.controller;

import com.moemhub.moem.constant.ApplicationConstants;
import com.moemhub.moem.dto.JwtToken;
import com.moemhub.moem.dto.LoginDto;
import com.moemhub.moem.dto.RegisterDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtToken> login(@RequestBody LoginDto loginDto) {
        JwtToken jwtToken = authService.login(loginDto);
        if(jwtToken != null) {
            return ResponseEntity.ok(jwtToken);
        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refresh(HttpServletRequest request) {
        String refreshToken = request.getHeader(ApplicationConstants.JWT_HEADER);
        String accessToken = authService.refresh(refreshToken);
        return ResponseEntity.ok(accessToken);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterDto registerDto) {
        if(authService.register(registerDto)){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    @PostMapping("/test")
    public ResponseEntity<Void> test() {
        return ResponseEntity.ok().build();
    }
}
