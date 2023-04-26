package com.ssafy.hearo.domain.setting.controller;

import com.ssafy.hearo.domain.setting.entity.Setting;
import com.ssafy.hearo.domain.setting.service.SettingService;
import com.ssafy.hearo.global.common.response.ResponseService;
import com.ssafy.hearo.global.common.response.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("profile")
@RequiredArgsConstructor
public class SettingController {

    private final ResponseService responseService;
    private final SettingService settingService;

    @PostMapping("/setting")
    public ResponseEntity<Result> getSettingInfo(@RequestBody String userSeq) {
        Setting response = settingService.getSettingByUserSeq(Long.parseLong(userSeq));
        return ResponseEntity.ok()
                .body(responseService.getSingleResult(response));
    }
}
