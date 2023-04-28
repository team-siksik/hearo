package com.ssafy.hearo.domain.account.service;


import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.dto.AccountDto;
import com.ssafy.hearo.domain.account.entity.Role;
import com.ssafy.hearo.domain.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;


    public void signUp(AccountDto userDto) throws Exception {

        if (accountRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new Exception("이미 존재하는 이메일입니다.");
        }

        Account account = Account.builder()
                .email(userDto.getEmail())
                .nickname(userDto.getName())
                .imageUrl(userDto.getPicture())
                .userRole(Role.USER)
                .userPassword(userDto.getPassword())
                .delYn("0")
                .build();

        accountRepository.save(account);
    }

    public void withdraw(Account account) {
        Account user = account.getUser();
        user.withdraw();
        accountRepository.save(user);
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public void signOut(Account account) {
        Account user = account.getUser();
        user.signOut();
        accountRepository.save(user);
    }

    public List<Account> searchEmail(String userEmail) {
        List<Account> searchList = accountRepository.findByEmailContainingIgnoreCase(userEmail);
        if (searchList.isEmpty()) {
            throw new IllegalArgumentException("해당 이메일을 가진 유저가 없습니다.");
        }
        return searchList;

    }
}