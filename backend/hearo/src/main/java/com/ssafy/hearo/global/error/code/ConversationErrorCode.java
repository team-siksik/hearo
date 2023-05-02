package com.ssafy.hearo.global.error.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ConversationErrorCode implements ErrorCode {

    ROOM_EXIST("CV_001", "진행 중인 대화가 이미 존재합니다.", HttpStatus.BAD_REQUEST),
    ROOM_NOT_VALID("CV_002", "유효한 대화가 아닙니다.", HttpStatus.BAD_REQUEST),
    ROOM_NOT_EXIST("CV_003", "이미 종료된 대화입니다.", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

}
