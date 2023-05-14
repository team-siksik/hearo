package com.ssafy.hearo.domain.conversation.controller;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.dto.ConversationResponseDto.*;
import com.ssafy.hearo.domain.conversation.service.ConversationService;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/conversation")
@RequiredArgsConstructor
@Slf4j
public class ConversationController {

    private final ResponseService responseService;
    private final ConversationService conversationService;

    @PostMapping("/room/start")
    public ResponseEntity<Result> startConversation(@LoginUser Account account, @RequestBody StartConversationRequestDto requestDto) {
        log.info("[startConversation] 대화 시작 API 호출 - {}", account.getEmail());
        StartConversationResponseDto result = conversationService.startConversation(account, requestDto);
        log.info("[startConversation] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }

    @PutMapping("/room/{conversationSeq}/close")
    public ResponseEntity<Result> endConversation(@LoginUser Account account, @PathVariable long conversationSeq) {
        log.info("[endConversation] 대화 종료 API 호출 - {}", account.getEmail());
        EndConversationResponseDto result = conversationService.endConversation(account, conversationSeq);
        log.info("[endConversation] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }

    @PostMapping("/room/{conversationSeq}/save")
    public ResponseEntity<Result> saveConversation(@LoginUser Account account, @PathVariable long conversationSeq, @RequestPart("audio") MultipartFile audio, @RequestPart("memo") SaveConversationRequestDto requestDto) {
        log.info("[saveConversation] 대화 저장 API 호출 - {}", account.getEmail());
        conversationService.saveConversation(account, conversationSeq, audio, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }
}
