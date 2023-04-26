package com.ssafy.hearo.domain.account.service;

import com.ssafy.hearo.domain.account.dto.request.SignInRequestDto;
import com.ssafy.hearo.domain.account.dto.response.RefreshResponseDto;
import com.ssafy.hearo.domain.account.dto.response.SignInResponseDto;
import com.ssafy.hearo.domain.account.entity.Account;

import javax.servlet.http.HttpServletRequest;

public interface AccountService {

    SignInResponseDto signIn(SignInRequestDto requestDto);

    void signOut(Account account);

    void withdraw(Account account);

    RefreshResponseDto refresh(Account account, HttpServletRequest request);
}
