package com.ssafy.hearo.global.error.code;

import org.springframework.http.HttpStatus;

public interface ErrorCode {

    String name();
    String getCode();
    String getMessage();
    HttpStatus getHttpStatus();


}
