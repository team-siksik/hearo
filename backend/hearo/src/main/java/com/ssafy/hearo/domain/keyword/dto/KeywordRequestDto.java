package com.ssafy.hearo.domain.keyword.dto;

import lombok.Getter;

import java.util.List;

public class KeywordRequestDto {

    @Getter
    public static class CreateSituationRequestDto {

        private String keyword;
        private List<String> sentences;
    }
}
