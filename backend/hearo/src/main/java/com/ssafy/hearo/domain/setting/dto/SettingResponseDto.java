package com.ssafy.hearo.domain.setting.dto;

import lombok.Builder;
import lombok.Getter;

public class SettingResponseDto {

    @Getter
    @Builder
    public static class SettingInfoResponseDto {

        private long settingSeq;
        private long userSeq;
        private byte wordSize;
        private byte voiceSetting;
        private byte darkMode;
        private String mainTheme;
    }

    @Getter
    @Builder
    public static class FrequentResponseDto {

        private Long frequentSeq;
        private String sentence;
    }

}
