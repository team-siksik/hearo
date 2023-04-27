package com.ssafy.hearo.domain.account.service;


import com.ssafy.hearo.domain.account.repository.AccountRepository;
import com.ssafy.hearo.global.error.code.AccountErrorCode;
import com.ssafy.hearo.global.error.exception.ErrorException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        return (UserDetails) accountRepository.findByEmailAndDelYn(id, "0").orElseThrow(() -> new ErrorException(AccountErrorCode.ACCOUNT_NOT_FOUND));
    }

}
