package com.ssafy.hearo.domain.setting.repository;

import com.ssafy.hearo.domain.setting.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SettingRepository extends JpaRepository <Setting, Long> {

}
