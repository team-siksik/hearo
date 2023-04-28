package com.ssafy.hearo.domain.setting.dto;

import lombok.Getter;


public class SettingRequestDto {

    @Getter
    public static class ModifySettingRequestDto {

        private long settingSeq;
        private long userSeq;
        private byte fontSize;
        private byte voiceSetting;
    }

    @Getter
    public static class FrequentRequestDto {

        private String sentence;
    }
}
