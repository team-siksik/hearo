package com.ssafy.hearo.global.config.jwt;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


import java.util.Date;

@Component
public class JwtTokenProvider {
    private final String secretKey = "mySecretKey"; // JWT 비밀 키
    private final long tokenValidTime = 1000L * 60 * 60 * 36; // JWT 토큰 유효 시간 36시간
    private final long refreshTokenValidTime = 1000L * 60 * 60 * 24 * 7; // JWT 갱신 토큰 유효 시간 1주일

    // JWT 토큰 생성
    public String generateToken(String email) {
        Date now = new Date();
        return Jwts.builder()
                .setId(email)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + tokenValidTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    // JWT 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // JWT 갱신 토큰 생성
    public String generateRefreshToken(String email) {
        Date now = new Date();
        return Jwts.builder()
                .setId(email)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + refreshTokenValidTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    // JWT 토큰에서 이메일 추출
    public String getEmailFromToken(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getId();
    }

    // JWT 토큰에서 만료 시간 추출
    public Date getExpirationDateFromToken(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getExpiration();
    }

    // JWT 토큰 갱신
    public String refreshToken(String token) {
        if (!validateToken(token)) {
            return null;
        }

        String email = getEmailFromToken(token);
        String refreshToken = generateRefreshToken(email);
        return refreshToken;
    }
}
