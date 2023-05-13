package com.ssafy.hearo.domain.memo.dto;

import lombok.Builder;
import lombok.Getter;

public class MemoResponseDto {

    @Getter
    @Builder
    public static class MemoInfoResponseDto {
        private Long memoSeq;
        private String content;
        private Long timestamp;
    }
}
