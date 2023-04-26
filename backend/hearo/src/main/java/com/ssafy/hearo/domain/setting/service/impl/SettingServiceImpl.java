package com.ssafy.hearo.domain.setting.service.impl;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.setting.dto.SettingReqDto.*;
import com.ssafy.hearo.domain.setting.dto.SettingResDto.*;
import com.ssafy.hearo.domain.setting.entity.Setting;
import com.ssafy.hearo.domain.setting.repository.SettingRepository;
import com.ssafy.hearo.domain.setting.service.SettingService;
import com.ssafy.hearo.global.error.code.CommonErrorCode;
import com.ssafy.hearo.global.error.exception.ErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SettingServiceImpl implements SettingService {

    private final SettingRepository settingRepository;

    @Override
    public SettingInfoResDto getSetting(Account account) {
        log.info("[getSetting] 설정 조회 시작");

        Setting setting = settingRepository.findById(account.getUserSeq())
                        .orElseThrow(() -> new ErrorException(CommonErrorCode.BAD_REQUEST));

        log.info("[getSetting] 설정 조회 완료");

        return SettingInfoResDto.builder()
                .settingSeq(setting.getSettingSeq())
                .userSeq(setting.getAccount().getUserSeq())
                .wordSize(setting.getWordSize())
                .voiceSetting(setting.getVoiceSetting())
                .darkMode(setting.getDarkMode())
                .mainTheme(setting.getMainTheme())
                .build();
    }

    @Override
    public void modifySetting(Account account, ModifySettingRequestDto requestDto) {
        log.info("[modifySetting] 설정 수정 시작");

        Setting setting = settingRepository.findById(account.getUserSeq())
                .orElseThrow(() -> new ErrorException(CommonErrorCode.BAD_REQUEST));

        byte wordSize = requestDto.getWordSize();
        byte voiceSetting = requestDto.getVoiceSetting();
        byte darkMode = requestDto.getDarkMode();
        String mainTheme = requestDto.getMainTheme();

        setting.modify(wordSize, voiceSetting, darkMode, mainTheme);

        log.info("[modifySetting] 설정 수정 완료");
    }


}
