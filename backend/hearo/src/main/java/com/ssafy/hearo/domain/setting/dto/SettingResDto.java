package com.ssafy.hearo.domain.setting.dto;

import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

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

    @Getter
    @Builder
    public static class FrequentResDto {

        private Long frequentSeq;
        private String sentence;
    }

}
