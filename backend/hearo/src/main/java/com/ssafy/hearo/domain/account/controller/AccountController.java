package com.ssafy.hearo.domain.account.controller;

import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import com.ssafy.hearo.domain.account.dto.request.SignInRequestDto;
import com.ssafy.hearo.domain.account.dto.response.RefreshResponseDto;
import com.ssafy.hearo.domain.account.dto.response.SignInResponseDto;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
@Slf4j
public class AccountController {

    private final ResponseService responseService;
    private final AccountService accountService;
    @GetMapping("")
    public String sample(){
        return "일단 되는가";
    }

    @PostMapping("/oauth2/code/google/")
    public ResponseEntity<Result> signIn(@RequestBody SignInRequestDto requestDto) {
        SignInResponseDto responseDto = accountService.signIn(requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(responseDto));
    }

    @PutMapping("/sign-out")
    public ResponseEntity<Result> signOut(@LoginUser Account account) {
        accountService.signOut(account);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @PutMapping("/withdraw")
    public ResponseEntity<Result> withdraw(@LoginUser Account account) {
        accountService.withdraw(account);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @PutMapping("/refresh")
    public ResponseEntity<Result> refresh(@LoginUser Account account, HttpServletRequest request) {
        RefreshResponseDto result = accountService.refresh(account, request);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }

}
