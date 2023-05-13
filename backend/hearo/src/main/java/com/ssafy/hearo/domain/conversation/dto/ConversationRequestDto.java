package com.ssafy.hearo.domain.conversation.dto;

import lombok.Getter;

import java.util.List;

public class ConversationRequestDto {

    @Getter
    public static class StartConversationRequestDto {

        private String roomType;
    }

    @Getter
    public static class SaveConversationMemoRequestDto {

        private String content;
        private Long timestamp;

    }

    @Getter
    public static class SaveConversationRequestDto {

        private List<SaveConversationMemoRequestDto> memo;
    }

}
