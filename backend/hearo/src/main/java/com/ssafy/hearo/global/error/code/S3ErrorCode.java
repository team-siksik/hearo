package com.ssafy.hearo.global.error.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum S3ErrorCode implements ErrorCode {

    S3_UPLOAD_FAILED("S3_001", "S3 업로드에 실패했습니다.",HttpStatus.SERVICE_UNAVAILABLE),
    S3_DOWNLOAD_FAILED("S3_002", "S3 다운로드에 실패했습니다.",HttpStatus.SERVICE_UNAVAILABLE);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

}
