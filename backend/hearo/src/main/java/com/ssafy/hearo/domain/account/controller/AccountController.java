package com.ssafy.hearo.domain.account.controller;



import com.ssafy.hearo.domain.account.dto.response.SignInResponseDto;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ssafy.hearo.domain.account.service.GoogleAuthService;
import com.ssafy.hearo.global.common.response.ResponseService;

import javax.transaction.Transactional;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class AccountController {

    private final GoogleAuthService googleAuthService;
    private final ResponseService responseService;

    @GetMapping("/login")
    public ResponseEntity<Result> getUserInfo(@RequestHeader("Authorization") String accessToken) {
        log.info("accessToken : {}", accessToken);
        SignInResponseDto jwt = googleAuthService.getUserInfo(accessToken);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(jwt));
    }

    @GetMapping("/jwt-test")
    public String jwtTest(@LoginUser Account account) {
        return "jwtTest 요청 성공";
    }
}