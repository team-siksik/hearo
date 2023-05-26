package com.ssafy.hearo.domain.keyword.controller;

import com.ssafy.hearo.domain.keyword.dto.KeywordRequestDto.CreateSituationRequestDto;
import com.ssafy.hearo.domain.keyword.dto.KeywordResponseDto.KeywordInfoResponseDto;
import com.ssafy.hearo.domain.keyword.dto.KeywordResponseDto.KeywordSentenceInfoResponseDto;
import com.ssafy.hearo.domain.keyword.service.KeywordService;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversation")
@RequiredArgsConstructor
@Slf4j
public class KeywordController {

    private final ResponseService responseService;
    private final KeywordService keywordService;

    @PostMapping("/recommend/yaong")
    public ResponseEntity<Result> createSituation(@RequestBody CreateSituationRequestDto requestDto) {
        log.info("[createSituation] 상황 키워드 및 문장 생성 API 호출 (개발용)");
        keywordService.createSituation(requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @GetMapping("/recommend/situation")
    public ResponseEntity<Result> getSituationKeywordList() {
        log.info("[getSituation] 상황 키워드 목록 조회 API 호출");
        List<KeywordInfoResponseDto> result = keywordService.getSituationKeywordList();
        log.info("[getSituation] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getListResult(result));
    }

    @GetMapping("/recommend/situation/{keywordSeq}")
    public ResponseEntity<Result> getSituationSentenceList(@PathVariable long keywordSeq) {
        log.info("[getSituationSentenceList] 상황 키워드 문장 목록 조회 API 호출");
        List<KeywordSentenceInfoResponseDto> result = keywordService.getSituationSentenceList(keywordSeq);
        log.info("[getSituationSentenceList] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getListResult(result));
    }
}