package com.ssafy.hearo.domain.conversation.controller;

import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.service.ConversationService;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
