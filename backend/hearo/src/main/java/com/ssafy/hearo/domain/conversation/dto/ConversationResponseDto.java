package com.ssafy.hearo.domain.conversation.dto;

import lombok.Builder;
import lombok.Getter;

public class ConversationResponseDto {

    @Getter
    @Builder
    public static class KeywordResponseDto {

        private long keywordSeq;
        private String keyword;

    }

    @Getter
    @Builder
    public static class KeywordSentenceResponseDto {

        private long sentenceSeq;
        private String keywordSentence;

    }

    @Getter
    @Builder
    public static class RoomResponseDto {

        private long roomSeq;
        private String regDtm;
        private String endDtm;

    }
}
