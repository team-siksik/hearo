package com.ssafy.hearo.domain.conversation.service.impl;

import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.entity.Keyword;
import com.ssafy.hearo.domain.conversation.entity.KeywordSentence;
import com.ssafy.hearo.domain.conversation.repository.KeywordRepository;
import com.ssafy.hearo.domain.conversation.repository.KeywordSentenceRepository;
import com.ssafy.hearo.domain.conversation.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ConversationServiceImpl implements ConversationService {

    private final KeywordRepository keywordRepository;
    private final KeywordSentenceRepository keywordSentenceRepository;

    public void createSituation(CreateSituationRequestDto requestDto) {
        log.info("[createSituation] 상황 키워드 생성 시작");
        String word = requestDto.getKeyword();
        Keyword keyword = Keyword.builder()
                .keyword(word)
                .build();
        keywordRepository.save(keyword);
        log.info("[createSituation] 상황 키워드 생성 완료 - {}", word);

        log.info("[createSituation] 상황 문장 생성 시작");
        List<String> sentences = requestDto.getSentences();
        for (String sentence : sentences) {
            KeywordSentence keywordSentence = KeywordSentence.builder()
                    .keyword(keyword)
                    .keywordSentence(sentence)
                    .build();
            keywordSentenceRepository.save(keywordSentence);
            log.info("[createSituation] 상황 문장 생성 완료 - {}", sentence);
        }
    }

}
