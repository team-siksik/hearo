package com.ssafy.hearo.domain.record.dto;

import lombok.Getter;

import java.util.List;


public class RecordRequestDto {

    @Getter
    public static class ModifyRecordTitleRequestDto {

        private String title;
    }

    @Getter
    public static class ModifyRecordFavoriteRequestDto {

        private Long isFavorite;
    }

    @Getter
    public static class DeleteRecordRequestDto {

        private List<Long> deleteRecordSeqList;
    }
}
