package com.ssafy.hearo.domain.setting.service;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.setting.dto.SettingReqDto.*;
import com.ssafy.hearo.domain.setting.dto.SettingResDto.*;

public interface SettingService {

    SettingInfoResDto getSetting(Account account);

    void modifySetting(Account account, ModifySettingRequestDto modifySettingRequestDto);
}
