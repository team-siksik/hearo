package com.ssafy.hearo.domain.account.controller;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.service.AccountService;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@Slf4j
public class AccountDetailController {
    private final ResponseService responseService;
    private final AccountService accountService;

    @GetMapping("/list")
    public ResponseEntity<Result> list() {
        return ResponseEntity.ok()
                .body(responseService.getListResult(accountService.findAll()));
    }

    @PatchMapping("/withdraw")
    public ResponseEntity<Result> withdraw(@LoginUser Account account) {
        accountService.withdraw(account);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @PutMapping("/sign-out")
    public ResponseEntity<Result> signOut(@LoginUser Account account) {
        accountService.signOut(account);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }
    @GetMapping("/search")
    public ResponseEntity<Result> getAccountByUserId(@RequestParam String userEmail) {
        List<Account> searchList = accountService.searchEmail(userEmail);
        return ResponseEntity.ok()
                .body(responseService.getListResult(searchList));
    }
}
