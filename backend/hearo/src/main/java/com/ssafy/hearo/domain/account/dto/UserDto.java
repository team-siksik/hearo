package com.ssafy.hearo.domain.account.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class UserDto {
    private String userId;
    private String userName;
    private String userImageUrl;
}
