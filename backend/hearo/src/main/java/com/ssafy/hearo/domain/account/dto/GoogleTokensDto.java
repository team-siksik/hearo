package com.ssafy.hearo.domain.account.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GoogleTokensDto {
    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("expires_in")
    private Integer expiresIn;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("id_token")
    private String idToken;

    // getters and setters
}
