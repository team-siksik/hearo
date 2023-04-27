package com.ssafy.hearo.domain.account.dto.request;

import lombok.Getter;

@Getter
public class SignInRequestDto {

    private String id;
    private String name;
    private String deviceToken;
    private String imageUrl;
    private String role;

}
