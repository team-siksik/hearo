package com.ssafy.hearo.domain.conversation.controller;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.RecordResponseDto.*;
import com.ssafy.hearo.domain.conversation.dto.RecordRequestDto.*;
import com.ssafy.hearo.domain.conversation.service.RecordService;
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
@RequestMapping("/record")
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
                .body(responseService.getListResult(result));
    }

    @GetMapping("/favorite")
    public ResponseEntity<Result> getFavoriteRecordList(@LoginUser Account account, Pageable pageable) {
        log.info("[getFavoriteRecordList] 즐겨찾는 기록 목록 조회 API 호출 - {}", account.getEmail());
        List<GetRecordListResponseDto> result = recordService.getFavoriteRecordList(account, pageable);
        log.info("[getFavoriteRecordList] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getListResult(result));
    }

    @GetMapping("/{recordSeq}")
    public ResponseEntity<Result> getRecord(@LoginUser Account account, @PathVariable long recordSeq) {
        log.info("[getRecord] 기록 조회 API 호출 - {}", account.getEmail());
        GetRecordResponseDto result = recordService.getRecord(account, recordSeq);
        log.info("[getRecord] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }

    @PutMapping("/{recordSeq}")
    public ResponseEntity<Result> modifyRecordTitle(@LoginUser Account account, @PathVariable long recordSeq, @RequestBody ModifyRecordTitleRequestDto requestDto) {
        log.info("[modifyRecordTitle] 기록 제목 수정 API 호출 - {}", account.getEmail());
        recordService.modifyRecordTitle(account, recordSeq, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @PutMapping("/{recordSeq}/favorite")
    public ResponseEntity<Result> modifyRecordFavorite(@LoginUser Account account, @PathVariable long recordSeq, @RequestBody ModifyRecordFavoriteRequestDto requestDto) {
        log.info("[modifyRecordFavorite] 기록 즐겨찾기 수정 API 호출 - {}", account.getEmail());
        recordService.modifyRecordFavorite(account, recordSeq, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

//    @PutMapping("/frequent/{frequentSeq}/delete")
//    public ResponseEntity<Result> removeFrequent(@LoginUser Account account, @PathVariable long frequentSeq) {
//        log.info("[modifyFrequent] 자주 쓰는 말 삭제 API 호출 - {}", account.getEmail());
//        settingService.removeFrequent(account, frequentSeq);
//        return ResponseEntity.ok()
//                .body(responseService.getSuccessResult());
//    }
}
