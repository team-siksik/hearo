package com.ssafy.hearo.domain.setting.dto;

import lombok.Builder;
import lombok.Getter;

public class SettingResDto {

    @Getter
    @Builder
    public static class SettingInfoResDto {

        private long settingSeq;
        private long userSeq;
        private byte wordSize;
        private byte voiceSetting;
        private byte darkMode;
        private String mainTheme;
    }

}
