package com.ssafy.hearo.domain.account.controller;


import com.ssafy.hearo.domain.account.dto.UserDto;
import com.ssafy.hearo.domain.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AccountController{

    private final AccountService accountService;

    @PostMapping("/sign-up")
    public String signUp(@RequestBody UserDto userSignUpDto) throws Exception {
        accountService.signUp(userSignUpDto);
        return "회원가입 성공";
    }

    @GetMapping("/jwt-test")
    public String jwtTest() {
        return "jwtTest 요청 성공";
    }
}