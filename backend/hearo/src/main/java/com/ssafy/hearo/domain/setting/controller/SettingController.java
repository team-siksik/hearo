package com.ssafy.hearo.domain.setting.controller;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.repository.AccountRepository;
import com.ssafy.hearo.domain.setting.dto.SettingResponseDto.*;
import com.ssafy.hearo.domain.setting.dto.SettingRequestDto.*;
import com.ssafy.hearo.domain.setting.repository.SettingRepository;
import com.ssafy.hearo.domain.setting.service.SettingService;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Slf4j
public class SettingController {

    private final ResponseService responseService;
    private final SettingService settingService;

    @GetMapping("/setting")
    public ResponseEntity<Result> getSetting(@LoginUser Account account) {
        log.info("[getSetting] 설정 조회 API 호출 - {}", account.getEmail());
        SettingInfoResponseDto result = settingService.getSetting(account);
        log.info("[getSetting] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }

    @PutMapping("/setting/update")
    public ResponseEntity<Result> modifySetting(@LoginUser Account account, @RequestBody ModifySettingRequestDto requestDto) {
        log.info("[modifySetting] 설정 수정 API 호출 - {}", account.getEmail());
        settingService.modifySetting(account, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @GetMapping("/frequent")
    public ResponseEntity<Result> getFrequentList(@LoginUser Account account) {
        log.info("[getFrequentList] 자주 쓰는 말 목록 조회 API 호출 - {}", account.getEmail());
        List<FrequentResponseDto> result = settingService.getFrequentList(account);
        log.info("[getFrequentList] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getListResult(result));
    }

    @PostMapping("/frequent")
    public ResponseEntity<Result> createFrequent(@LoginUser Account account, @RequestBody @Valid FrequentRequestDto requestDto) {
        log.info("[creatFrequent] 자주 쓰는 말 생성 API 호출 - {}", account.getEmail());
        settingService.createFrequent(account, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @PutMapping("/frequent/{frequentSeq}")
    public ResponseEntity<Result> modifyFrequent(@LoginUser Account account, @PathVariable long frequentSeq, @RequestBody FrequentRequestDto requestDto) {
        log.info("[modifyFrequent] 자주 쓰는 말 수정 API 호출 - {}", account.getEmail());
        settingService.modifyFrequent(account, frequentSeq, requestDto);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }

    @PutMapping("/frequent/{frequentSeq}/delete")
    public ResponseEntity<Result> removeFrequent(@LoginUser Account account, @PathVariable long frequentSeq) {
        log.info("[modifyFrequent] 자주 쓰는 말 삭제 API 호출 - {}", account.getEmail());
        settingService.removeFrequent(account, frequentSeq);
        return ResponseEntity.ok()
                .body(responseService.getSuccessResult());
    }
}
