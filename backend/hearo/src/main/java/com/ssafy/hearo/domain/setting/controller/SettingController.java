package com.ssafy.hearo.domain.setting.controller;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.setting.dto.SettingResDto.*;
import com.ssafy.hearo.domain.setting.service.SettingService;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("profile")
@RequiredArgsConstructor
@Slf4j
public class SettingController {

    private final ResponseService responseService;
    private final SettingService settingService;

    @PostMapping("/setting")
    public ResponseEntity<Result> getSetting(Account account) {
        log.info("[getSetting] 설정 조회 API 호출 > {}", account);
        SettingInfoResDto result = settingService.getSetting(account);
        log.info("[getSetting] result: {}", result);
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(result));
    }
}
