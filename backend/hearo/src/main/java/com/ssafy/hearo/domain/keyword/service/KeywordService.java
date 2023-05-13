package com.ssafy.hearo.domain.keyword.service;

import com.ssafy.hearo.domain.keyword.dto.KeywordRequestDto.*;
import com.ssafy.hearo.domain.keyword.dto.KeywordResponseDto.*;

import java.util.List;

public interface KeywordService {

    void createSituation(CreateSituationRequestDto requestDto);

    List<KeywordInfoResponseDto> getSituationKeywordList();

    List<KeywordSentenceInfoResponseDto> getSituationSentenceList(long keywordSeq);
}
