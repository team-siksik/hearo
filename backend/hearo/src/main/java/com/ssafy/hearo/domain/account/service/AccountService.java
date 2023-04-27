package com.ssafy.hearo.domain.account.service;

import com.ssafy.hearo.domain.account.dto.UserDto;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.entity.Role;
import com.ssafy.hearo.domain.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository userRepository;


    public void signUp(UserDto userDto) throws Exception {

        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new Exception("이미 존재하는 이메일입니다.");
        }

        Account account = Account.builder()
                .email(userDto.getEmail())
                .nickname(userDto.getUserName())
                .imageUrl(userDto.getUserImageUrl())
                .role(Role.USER)
                .delYn("0")
                .build();

        userRepository.save(account);
    }
}