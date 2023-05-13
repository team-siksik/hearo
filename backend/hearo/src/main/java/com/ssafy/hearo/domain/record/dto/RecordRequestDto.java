package com.ssafy.hearo.domain.record.dto;

import lombok.Getter;


public class RecordRequestDto {

    @Getter
    public static class ModifyRecordTitleRequestDto {

        private String title;
    }

    @Getter
    public static class ModifyRecordFavoriteRequestDto {

        private Long isFavorite;
    }
}
