package com.ssafy.hearo.global.error.code;

import com.ssafy.hearo.global.error.code.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CommonErrorCode implements ErrorCode {

    BAD_REQUEST("CM_000", "잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    INVALID_PARAMETER("CM_001", "유효하지 않은 파라미터입니다.",HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND("CM_002", "리소스가 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    INTERNAL_SERVER_ERROR("CM_003", "서버 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

}
