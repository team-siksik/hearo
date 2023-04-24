package com.ssafy.hearo.domain.user.dto;


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
