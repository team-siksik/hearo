package com.ssafy.hearo.domain.account.dto.response;

import com.ssafy.hearo.domain.account.entity.Role;
import com.ssafy.hearo.domain.setting.entity.Setting;
import lombok.Builder;
import lombok.Getter;

import java.util.Optional;

@Getter
@Builder
public class SignInResponseDto {
    private Long userSeq;
    private String accessToken;
    private String nickname;
    private String email;
    private String profileImg;
    private String delYn;
    private Role role;
    private Setting setting = null;
}
