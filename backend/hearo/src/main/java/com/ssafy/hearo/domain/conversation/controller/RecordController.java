package com.ssafy.hearo.domain.conversation.controller;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.RecordResponseDto.*;
import com.ssafy.hearo.domain.conversation.service.RecordService;
import com.ssafy.hearo.domain.setting.entity.FrequentSentence;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/note")
@RequiredArgsConstructor
@Slf4j
public class RecordController {

    private final ResponseService responseService;
    private final RecordService recordService;

    @GetMapping()
    public ResponseEntity<Result> getRecordList(@LoginUser Account account, Pageable pageable) {
        log.info("[getRecordList] 기록 목록 조회 API 호출 - {}", account.getEmail());
        List<GetRecordListResponseDto> result = recordService.getRecordList(account, pageable);
        log.info("[getRecordList] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }
}
