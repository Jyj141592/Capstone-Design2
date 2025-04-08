package com.moemhub.moem.security;

import com.moemhub.moem.dto.JwtToken;
import com.moemhub.moem.service.MoemUserDetailsService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;


@Component
public class JwtTokenProvider {
    private final SecretKey secretKey;
    private final UserDetailsService userDetailsService;

    public JwtTokenProvider(@Value("${jwt.key}") String secret, UserDetailsService userDetailsService) {
        secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.userDetailsService = userDetailsService;
    }

    public JwtToken generateToken(Authentication authentication){
        String accessToken = generateAccessToken(authentication);
        String refreshToken = generateRefreshToken(authentication);
        return new JwtToken("Bearer", accessToken, refreshToken);
    }

    public String generateByRefreshToken(String refreshToken) {
        return generateAccessToken(getAuthentication(refreshToken));
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload();
        String username = claims.getSubject();
        UserDetails user = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(user, "", user.getAuthorities());
    }

    private String generateAccessToken(Authentication authentication) {
        return Jwts.builder().issuer("MoEm")
                .subject(authentication.getName())
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + 30000000))
                .signWith(secretKey).compact();
    }
    private String generateRefreshToken(Authentication authentication) {
        return Jwts.builder()
                .subject(authentication.getName())
                .expiration(new Date((new Date()).getTime() + 86400000))
                .signWith(secretKey)
                .compact();
    }
}
