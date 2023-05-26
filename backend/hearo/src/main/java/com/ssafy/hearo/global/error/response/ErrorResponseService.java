package com.ssafy.hearo.global.error.response;

import com.ssafy.hearo.global.error.code.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ErrorResponseService {

    private ErrorResponse makeErrorResponse(final ErrorCode errorCode) {
        return ErrorResponse.builder()
                .success(false)
                .code(errorCode.getCode())
                .error(errorCode.name())
                .message(errorCode.getMessage())
                .build();
    }

    public ResponseEntity<Object> handleExceptionInternal(final ErrorCode errorCode) {
        log.error("[ErrorResponse] {}: {} {} {}", errorCode.getHttpStatus(), errorCode.getCode(), errorCode.name(), errorCode.getMessage());
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(makeErrorResponse(errorCode));
    }

    public ResponseEntity<Object> handleValidationExceptionInternal(String code, String name, String message) {
        log.error("[ErrorResponse] {}: {} {} {}", HttpStatus.BAD_REQUEST, code, name, message);
        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .code(code)
                .error(name)
                .message(message)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
