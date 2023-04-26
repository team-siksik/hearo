package com.ssafy.hearo.domain.setting.dto;

import lombok.Getter;


public class SettingReqDto {

    @Getter
    public static class ModifySettingRequestDto {

        private long settingSeq;
        private long userSeq;
        private byte wordSize;
        private byte voiceSetting;
        private byte darkMode;
        private String mainTheme;
    }

}
