package com.ssafy.hearo.domain.conversation.dto;

import lombok.Builder;
import lombok.Getter;

public class ConversationResponseDto {

    @Getter
    @Builder
    public static class StartConversationResponseDto {

        private long roomSeq;
        private String regDtm;
        private String endDtm;
        private String roomId;

    }

    @Getter
    @Builder
    public static class EndConversationResponseDto {

        private long roomSeq;
        private String regDtm;
        private String endDtm;

    }
}
