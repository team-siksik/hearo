package com.ssafy.hearo.domain.setting.service;

import com.ssafy.hearo.domain.setting.dto.SettingReqDto.*;
import com.ssafy.hearo.domain.setting.entity.Setting;
import com.ssafy.hearo.domain.setting.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingService {
    private final SettingRepository settingRepository;

    public Setting getSettingByUserSeq(long userSeq) {
//        long userSeq = requestDto.getUserSeq();
        return settingRepository.findById(userSeq).orElse(null);
    }
}
