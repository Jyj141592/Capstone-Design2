package com.moemhub.moem.controller;

import com.moemhub.moem.constant.ApplicationConstants;
import com.moemhub.moem.dto.JwtToken;
import com.moemhub.moem.dto.LoginDto;
import com.moemhub.moem.dto.RegisterDto;
import com.moemhub.moem.dto.AccountInfoDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.service.AuthService;
import com.moemhub.moem.repository.AccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtToken> login(@RequestBody LoginDto loginDto) {
        try {
            JwtToken jwtToken = authService.login(loginDto);

            if (jwtToken != null) {
                return ResponseEntity.ok(jwtToken);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        catch (Exception e){
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
        if(refreshToken == null || refreshToken.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String accessToken = authService.refresh(refreshToken.split(" ")[1]);
            return ResponseEntity.ok(accessToken);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestPart("data") RegisterDto registerDto,
    										@RequestPart(value="profile", required=false) MultipartFile profile) {
        try {
            if (authService.register(registerDto, profile)) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/privilege/{clubId}")
    public ResponseEntity<String> clubPrivilege(@PathVariable(name="clubId") Long clubId, Authentication authentication){
    		
    		return ResponseEntity.ok(authService.clubPrivilege(authentication.getName(), clubId));
    }
}
