package com.ssafy.hearo.domain.setting.dto;

import lombok.Getter;

import javax.validation.constraints.NotBlank;


public class SettingRequestDto {

    @Getter
    public static class ModifySettingRequestDto {

        private byte fontSize;
        private byte voiceSetting;
    }

    @Getter
    public static class FrequentRequestDto {

        @NotBlank
        private String sentence;
    }
}
