package com.ssafy.hearo.domain.keyword.service.impl;

import com.ssafy.hearo.domain.keyword.dto.KeywordRequestDto.CreateSituationRequestDto;
import com.ssafy.hearo.domain.keyword.dto.KeywordResponseDto.*;
import com.ssafy.hearo.domain.keyword.service.KeywordService;
import com.ssafy.hearo.domain.keyword.entity.Keyword;
import com.ssafy.hearo.domain.keyword.entity.KeywordSentence;
import com.ssafy.hearo.domain.keyword.repository.KeywordRepository;
import com.ssafy.hearo.domain.keyword.repository.KeywordSentenceRepository;
import com.ssafy.hearo.global.error.code.CommonErrorCode;
import com.ssafy.hearo.global.error.exception.ErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class KeywordServiceImpl implements KeywordService {

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
    public List<KeywordInfoResponseDto> getSituationKeywordList() {
        log.info("[getSituation] 상황 키워드 목록 조회 시작");
        List<Keyword> keywordList = keywordRepository.findAll();
        List<KeywordInfoResponseDto> result = new ArrayList<>();
        for (Keyword keyword : keywordList) {
            result.add(KeywordInfoResponseDto.builder()
                            .keywordSeq(keyword.getKeywordSeq())
                            .keyword(keyword.getKeyword())
                            .build());
        }
        log.info("[getSituation] 상황 키워드 목록 조회 완료");
        return result;
    }

    @Override
    public List<KeywordSentenceInfoResponseDto> getSituationSentenceList(long keywordSeq) {
        log.info("[getSituationSentenceList] 상황 키워드 문장 목록 조회 시작");
        Keyword keyword = keywordRepository.findById(keywordSeq)
                .orElseThrow(() -> new ErrorException(CommonErrorCode.BAD_REQUEST));
        List<KeywordSentence> sentenceList = keywordSentenceRepository.findByKeyword(keyword);
        List<KeywordSentenceInfoResponseDto> result = new ArrayList<>();
        for (KeywordSentence sentence : sentenceList) {
            result.add(KeywordSentenceInfoResponseDto.builder()
                            .sentenceSeq(sentence.getSentenceSeq())
                            .keywordSentence(sentence.getSentence())
                            .build());
        }
        log.info("[getSituationSentenceList] 상황 키워드 문장 목록 조회 완료");
        return result;
    }
}
