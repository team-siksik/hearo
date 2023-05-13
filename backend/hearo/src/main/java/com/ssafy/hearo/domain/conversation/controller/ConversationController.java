package com.ssafy.hearo.domain.conversation.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.dto.ConversationResponseDto.*;
import com.ssafy.hearo.domain.conversation.service.ConversationService;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/conversation")
@RequiredArgsConstructor
@Slf4j
public class ConversationController {

    private final ResponseService responseService;
    private final ConversationService conversationService;

    @PostMapping("/recommend/yaong")
    public ResponseEntity<Result> createSituation(@RequestBody CreateSituationRequestDto requestDto) {
        log.info("[createSituation] 상황 키워드 및 문장 생성 API 호출 (개발용)");
        conversationService.createSituation(requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @GetMapping("/recommend/situation")
    public ResponseEntity<Result> getSituationKeywordList() {
        log.info("[getSituation] 상황 키워드 목록 조회 API 호출");
        List<KeywordResponseDto> result = conversationService.getSituationKeywordList();
        log.info("[getSituation] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getListResult(result));
    }

    @GetMapping("/recommend/situation/{keywordSeq}")
    public ResponseEntity<Result> getSituationSentenceList(@PathVariable long keywordSeq) {
        log.info("[getSituationSentenceList] 상황 키워드 문장 목록 조회 API 호출");
        List<KeywordSentenceResponseDto> result = conversationService.getSituationSentenceList(keywordSeq);
        log.info("[getSituationSentenceList] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getListResult(result));
    }

    @PostMapping("/room/start")
    public ResponseEntity<Result> startConversation(@LoginUser Account account, @RequestBody StartConversationRequestDto requestDto) {
        log.info("[startConversation] 대화 시작 API 호출");
        StartConversationResponseDto result = conversationService.startConversation(account, requestDto);
        log.info("[startConversation] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }

    @PutMapping("/room/{conversationSeq}/close")
    public ResponseEntity<Result> endConversation(@LoginUser Account account, @PathVariable long conversationSeq) {
        log.info("[endConversation] 대화 종료 API 호출");
        EndConversationResponseDto result = conversationService.endConversation(account, conversationSeq);
        log.info("[endConversation] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }

    @PostMapping("/room/{conversationSeq}/save")
    public ResponseEntity<Result> saveConversation(@LoginUser Account account, @PathVariable long conversationSeq, @RequestPart("audio") MultipartFile audio, @RequestPart("memo") SaveConversationRequestDto requestDto) {
        log.info("[saveConversation] 대화 저장 API 호출");
        conversationService.saveConversation(account, conversationSeq, audio, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }
}
