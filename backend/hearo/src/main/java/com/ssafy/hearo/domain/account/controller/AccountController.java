package com.ssafy.hearo.domain.account.controller;

import com.ssafy.hearo.domain.account.dto.response.SignInResponseDto;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.service.AccountService;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ssafy.hearo.domain.account.service.GoogleAuthService;
import com.ssafy.hearo.global.common.response.ResponseService;


@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/accounts")
public class AccountController {

    private final GoogleAuthService googleAuthService;
    private final ResponseService responseService;
    private final AccountService accountService;

    @GetMapping("/login")
    public ResponseEntity<Result> getUserInfo(@RequestHeader("Authorization") String accessToken) {
        log.info("accessToken : {}", accessToken);
        SignInResponseDto jwt = googleAuthService.getUserInfo(accessToken);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(jwt));
    }

    @GetMapping("/jwt-test")
    public String jwtTest(@LoginUser Account account) {
        log.info(account.getEmail());
        return "jwtTest 요청 성공";
    }

    @PutMapping("/signout")
    public ResponseEntity<Result> signOut(@LoginUser Account account) {
        accountService.signOut(account);
        return ResponseEntity.ok().body(responseService.getSuccessResult());
    }

    @GetMapping("/list")
    public ResponseEntity<Result> getAccountList() {
        return ResponseEntity.ok().body(responseService.getListResult(accountService.accountList()));
    }

    @GetMapping("/search")
    public ResponseEntity<Result> searchAccount(@RequestParam String email) {
        return ResponseEntity.ok().body(responseService.getListResult(accountService.searchEmail(email)));
    }
}