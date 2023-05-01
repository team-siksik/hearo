package com.ssafy.hearo.domain.account.dto.response;

import com.ssafy.hearo.domain.account.entity.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignInResponseDto {

    private String accessToken;
    private String nickname;
    private String email;
    private String profileImg;
    private String delYn;
    private Role role;

}
