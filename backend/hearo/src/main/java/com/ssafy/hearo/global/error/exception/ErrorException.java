package com.ssafy.hearo.global.error.exception;

import com.ssafy.hearo.global.error.code.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ErrorException extends RuntimeException {

    private final ErrorCode errorCode;
}
