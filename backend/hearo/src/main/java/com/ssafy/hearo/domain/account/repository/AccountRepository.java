package com.ssafy.hearo.domain.account.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

        Optional<Account> findByUserId(String userId);

        Optional<Account> findByUserIdAndDelYn(String id, String delYn);
}
