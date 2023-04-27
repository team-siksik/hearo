package com.ssafy.hearo.domain.account.entity;


import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Builder
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_seq")
    private Long userSeq;

    private String email; // 이메일
    private String nickname; // 닉네임
    private String imageUrl; // 프로필 이미지

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "del_yn", length = 1 , columnDefinition = "varchar(1) default '0'")
    @ColumnDefault("0")
    private String delYn;


    private String socialId; // 로그인한 소셜 타입의 식별자 값 (일반 로그인인 경우 null)

    private String refreshToken; // 리프레시 토큰
// builder
    @Builder
    public Account(String email, String nickname, String imageUrl, Role role, String socialId, String refreshToken) {
        this.email = email;
        this.nickname = nickname;
        this.imageUrl = imageUrl;
        this.role = role;
        this.delYn = "0";
        this.socialId = socialId;
        this.refreshToken = refreshToken;
    }
    // 유저 권한 설정 메소드
    public void authorizeUser() {
        this.role = Role.USER;
    }


    public void updateRefreshToken(String updateRefreshToken) {
        this.refreshToken = updateRefreshToken;
    }
}