package com.ssafy.hearo.domain.conversation.service;

import com.ssafy.hearo.domain.conversation.dto.KeywordRequestDto.CreateSituationRequestDto;
import com.ssafy.hearo.domain.conversation.dto.KeywordResponseDto.KeywordInfoResponseDto;
import com.ssafy.hearo.domain.conversation.dto.KeywordResponseDto.KeywordSentenceInfoResponseDto;

import java.util.List;

public interface KeywordService {

    void createSituation(CreateSituationRequestDto requestDto);

    List<KeywordInfoResponseDto> getSituationKeywordList();

    List<KeywordSentenceInfoResponseDto> getSituationSentenceList(long keywordSeq);
}
