package com.ssafy.hearo.domain.setting.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.setting.entity.FrequentSentence;
import com.ssafy.hearo.domain.setting.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface SettingRepository extends JpaRepository <Setting, Long> {

    Optional<Setting> findByAccount(Account account);

}
