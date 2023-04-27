package com.ssafy.hearo.domain.conversation.service.impl;

import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.dto.ConversationResponseDto.*;
import com.ssafy.hearo.domain.conversation.entity.Keyword;
import com.ssafy.hearo.domain.conversation.entity.KeywordSentence;
import com.ssafy.hearo.domain.conversation.repository.KeywordRepository;
import com.ssafy.hearo.domain.conversation.repository.KeywordSentenceRepository;
import com.ssafy.hearo.domain.conversation.service.ConversationService;
import com.ssafy.hearo.global.error.code.CommonErrorCode;
import com.ssafy.hearo.global.error.exception.ErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ConversationServiceImpl implements ConversationService {

    private final KeywordRepository keywordRepository;
    private final KeywordSentenceRepository keywordSentenceRepository;

    @Override
    public void createSituation(CreateSituationRequestDto requestDto) {
        log.info("[createSituation] 상황 키워드 및 문장 생성 시작");

        log.info("[createSituation] 상황 키워드 생성 시작");
        String word = requestDto.getKeyword();
        Keyword keyword = Keyword.builder()
                .keyword(word)
                .build();
        keywordRepository.save(keyword);
        log.info("[createSituation] 상황 키워드 생성 완료 - {}", word);

        log.info("[createSituation] 상황 문장 생성 시작");
        List<String> sentenceList = requestDto.getSentences();
        for (String sentence : sentenceList) {
            KeywordSentence keywordSentence = KeywordSentence.builder()
                    .keyword(keyword)
                    .sentence(sentence)
                    .build();
            keywordSentenceRepository.save(keywordSentence);
            log.info("[createSituation] 상황 문장 생성 완료 - {}", sentence);
        }

        log.info("[createSituation] 상황 키워드 및 문장 생성 완료");
    }

    @Override
    public List<KeywordResponseDto> getSituationKeywordList() {
        log.info("[getSituation] 상황 키워드 목록 조회 시작");
        List<Keyword> keywordList = keywordRepository.findAll();
        List<KeywordResponseDto> result = new ArrayList<>();
        for (Keyword keyword : keywordList) {
            result.add(KeywordResponseDto.builder()
                            .keywordSeq(keyword.getKeywordSeq())
                            .keyword(keyword.getKeyword())
                            .build());
        }
        log.info("[getSituation] 상황 키워드 목록 조회 완료");
        return result;
    }

    @Override
    public List<KeywordSentenceResponseDto> getSituationSentenceList(long keywordSeq) {
        log.info("[getSituationSentenceList] 상황 키워드 문장 목록 조회 시작");
        Keyword keyword = keywordRepository.findById(keywordSeq)
                .orElseThrow(() -> new ErrorException(CommonErrorCode.BAD_REQUEST));
        List<KeywordSentence> sentenceList = keywordSentenceRepository.findByKeyword(keyword);
        List<KeywordSentenceResponseDto> result = new ArrayList<>();
        for (KeywordSentence sentence : sentenceList) {
            result.add(KeywordSentenceResponseDto.builder()
                            .sentenceSeq(sentence.getSentenceSeq())
                            .keywordSentence(sentence.getSentence())
                            .build());
        }
        log.info("[getSituationSentenceList] 상황 키워드 문장 목록 조회 완료");
        return result;
    }

}
