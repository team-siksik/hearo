package com.ssafy.hearo.domain.account.entity;


import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Getter
@Builder
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@DynamicInsert
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
@Table(name = "user")
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
    private String password;

    private String socialId; // 로그인한 소셜 타입의 식별자 값 (일반 로그인인 경우 null)

    private String refreshToken; // 리프레시 토큰
// builder
    @Builder
    public Account(String email, String nickname, String imageUrl, Role role, String socialId, String refreshToken, String password) {
        this.email = email;
        this.nickname = nickname;
        this.imageUrl = imageUrl;
        this.role = role;
        this.delYn = "0";
        this.socialId = socialId;
        this.refreshToken = refreshToken;
        this.password = password;
    }
    // 유저 권한 설정 메소드
    public void authorizeUser() {
        this.role = Role.USER;
    }

    public void withdraw() {
        this.delYn = "1";
    }

    public Account getUser() {
        return this;
    }

    public void signOut() {
        this.refreshToken = null;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setnickname(String name) {
        this.nickname = name;
    }

    public void setImageUrl(String picture) {
        this.imageUrl = picture;
    }
}