package com.ssafy.hearo.domain.conversation.dto;

import lombok.Getter;

import java.util.List;

public class RecordRequestDto {

    @Getter
    public static class ModifyRecordTitleRequestDto {

        private String title;
    }
}
