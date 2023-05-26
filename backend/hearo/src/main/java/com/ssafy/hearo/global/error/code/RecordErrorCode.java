package com.ssafy.hearo.global.error.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RecordErrorCode implements ErrorCode {

    RECORD_TIME_CALCULATION_FAILED("RC_001", "음성 길이 계산에 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE),
    GET_RECORD_PREVIEW_FAILED("RC_002", "미리보기 텍스트 불러오기에 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE),
    RECORD_NOT_EXIST("RC_003", "기록이 존재하지 않습니다.", HttpStatus.BAD_REQUEST),
    GET_RECORD_FAILED("RC_004", "클로바 Json 불러오기에 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE),
    AUDIO_CONVERT_FAILED("RC_005", "음성 형식 변환에 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

}
