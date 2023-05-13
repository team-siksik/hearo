package com.ssafy.hearo.global.config.jwt;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.repository.AccountRepository;
import com.ssafy.hearo.global.error.exception.AccountNotFoundException;
import com.ssafy.hearo.global.error.exception.TokenNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JwtService {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AccountRepository accountRepository;

    public String login(String email) {
        Optional<Account> optionalAccount = accountRepository.findByEmailAndDelYn(email,"0");

        // 해당 이메일의 계정이 없는 경우
        if (!optionalAccount.isPresent()) {
            throw new AccountNotFoundException();
        }

        Account account = optionalAccount.get();


        // JWT 토큰 발급
        String accessToken = jwtTokenProvider.generateToken(email);
        String refreshToken = jwtTokenProvider.generateRefreshToken(email);

        // 갱신 토큰 저장
        account.setRefreshToken(refreshToken);
        accountRepository.save(account);

        // JWT 토큰 반환
        return accessToken;
    }

    public String refresh(String refreshToken) {
        // 갱신 토큰이 유효한지 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new TokenNotFoundException();
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        Optional<Account> optionalAccount = accountRepository.findByEmail(email);

        // 해당 이메일의 계정이 없는 경우
        if (optionalAccount.isEmpty()) {
            throw new AccountNotFoundException();
        }

        Account account = optionalAccount.get();

        // 갱신 토큰이 일치하지 않는 경우
        if (!refreshToken.equals(account.getRefreshToken())) {
            throw new TokenNotFoundException();
        }

        // JWT 토큰 발급
        String accessToken = jwtTokenProvider.generateToken(email);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        // 갱신 토큰 갱신
        account.setRefreshToken(newRefreshToken);
        accountRepository.save(account);

        // JWT 토큰 반환
        return accessToken;
    }

    public String getEmail(String jwt) {
        return jwtTokenProvider.getEmailFromToken(jwt);
    }
}

