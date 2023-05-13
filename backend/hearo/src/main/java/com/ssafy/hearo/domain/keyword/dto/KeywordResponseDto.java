package com.ssafy.hearo.domain.keyword.dto;

import lombok.Builder;
import lombok.Getter;

public class KeywordResponseDto {

    @Getter
    @Builder
    public static class KeywordInfoResponseDto {

        private long keywordSeq;
        private String keyword;

    }

    @Getter
    @Builder
    public static class KeywordSentenceInfoResponseDto {

        private long sentenceSeq;
        private String keywordSentence;

    }
}
