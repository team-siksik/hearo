package com.ssafy.hearo.domain.memo.dto;

import lombok.Getter;

import java.util.List;


public class MemoRequestDto {

    @Getter
    public static class CreateMemoRequestDto {

        private Long timestamp;
        private String content;
    }

    @Getter
    public static class ModifyMemoRequestDto {

        private String content;
    }

    @Getter
    public static class DeleteMemoRequestDto {

        private List<Long> deleteMemoSeqList;
    }
}
