package com.ssafy.hearo.global.error.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RecordErrorCode implements ErrorCode {

    RECORD_TIME_CALCULATION_FAILED("RC_001", "음성 길이 계산에 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE),
    GET_RECORD_PREVIEW_FAILED("RC_002", "미리보기 텍스트 불러오기에 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

}
