package com.ssafy.hearo.domain.setting.service;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.setting.dto.SettingRequestDto.*;
import com.ssafy.hearo.domain.setting.dto.SettingResponseDto.*;

import java.util.List;

public interface SettingService {

    SettingInfoResponseDto getSetting(Account account);

    void modifySetting(Account account, ModifySettingRequestDto modifySettingRequestDto);

    List<FrequentResponseDto> getFrequentList(Account account);

    void createFrequent(Account account, FrequentRequestDto frequentRequestDto);

    void modifyFrequent(Account account, long frequentSeq, FrequentRequestDto frequentRequestDto);

    void removeFrequent(Account account, long frequentSeq);
}
