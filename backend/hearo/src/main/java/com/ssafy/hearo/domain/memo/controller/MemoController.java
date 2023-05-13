package com.ssafy.hearo.domain.memo.controller;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.memo.dto.MemoRequestDto.*;
import com.ssafy.hearo.domain.memo.dto.MemoResponseDto.*;
import com.ssafy.hearo.domain.memo.service.MemoService;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/record")
@RequiredArgsConstructor
@Slf4j
public class MemoController {

    private final ResponseService responseService;
    private final MemoService memoService;

    @GetMapping("/{recordSeq}/memo")
    public ResponseEntity<Result> getMemoList(@LoginUser Account account, @PathVariable long recordSeq) {
        log.info("[getMemoList] 메모 목록 조회 API 호출 - {}", account.getEmail());
        List<MemoInfoResponseDto> result = memoService.getMemoList(account, recordSeq);
        log.info("[getMemoList] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getListResult(result));
    }

    @PostMapping("/{recordSeq}/memo")
    public ResponseEntity<Result> createMemo(@LoginUser Account account, @PathVariable long recordSeq, @RequestBody CreateMemoRequestDto requestDto) {
        log.info("[createMemo] 메모 생성 API 호출 - {}", account.getEmail());
        memoService.createMemo(account, recordSeq, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @PutMapping("/{recordSeq}/memo/{memoSeq}")
    public ResponseEntity<Result> modifyMemo(@LoginUser Account account, @PathVariable long recordSeq, @PathVariable long memoSeq, @RequestBody ModifyMemoRequestDto requestDto) {
        log.info("[modifyMemo] 메모 수정 API 호출 - {}", account.getEmail());
        memoService.modifyMemo(account, recordSeq, memoSeq, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @PutMapping("/{recordSeq}/memo/delete")
    public ResponseEntity<Result> deleteMemo(@LoginUser Account account, @PathVariable long recordSeq, @RequestBody DeleteMemoRequestDto requestDto) {
        log.info("[deleteMemo] 메모 삭제 API 호출 - {}", account.getEmail());
        memoService.deleteMemo(account, recordSeq, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }
}
