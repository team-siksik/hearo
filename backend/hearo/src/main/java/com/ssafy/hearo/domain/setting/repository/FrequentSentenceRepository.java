package com.ssafy.hearo.domain.setting.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.setting.entity.FrequentSentence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FrequentSentenceRepository extends JpaRepository<FrequentSentence, Long> {
    List<FrequentSentence> findByAccountAndDelYn(Account account, byte delYn);

}
