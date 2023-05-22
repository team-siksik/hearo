package com.ssafy.hearo.domain.account.entity;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.hearo.domain.setting.entity.Setting;
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
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "user_seq")
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
    private Role userRole;

    private String userPassword;

    private String socialId; // 로그인한 소셜 타입의 식별자 값 (일반 로그인인 경우 null) 없애야하나

    private String refreshToken; // 리프레시 토큰

    @Column(name = "del_yn", length = 1 , columnDefinition = "varchar(1) default '0'")
    @ColumnDefault("0")
    private String delYn;

    @Builder
    public Account(String email, String nickname, String imageUrl, Role userRole, String socialId, String refreshToken, String userPassword) {
        this.email = email;
        this.nickname = nickname;
        this.imageUrl = imageUrl;
        this.userRole = userRole;
        this.delYn = "0";
        this.socialId = socialId;
        this.refreshToken = refreshToken;
        this.userPassword = userPassword;
    }
    // 유저 권한 설정 메소드
    public void authorizeUser() {
        this.userRole = Role.USER;
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