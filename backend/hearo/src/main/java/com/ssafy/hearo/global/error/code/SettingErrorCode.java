package com.ssafy.hearo.global.error.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SettingErrorCode implements ErrorCode {

    FONTSIZE_NOT_VALID("ST_001", "fontSize는 1, 2 중 선택할 수 있습니다.", HttpStatus.BAD_REQUEST),
    VOICESETTING_NOT_VALID("ST_002", "voiceSetting은 1, 2 중 선택할 수 있습니다.", HttpStatus.BAD_REQUEST),
    FREQUENT_EXCESS_LIMIT("ST_003", "자주 쓰는 말은 최대 10개 가질 수 있습니다.", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

}
