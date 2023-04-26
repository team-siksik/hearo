package com.ssafy.hearo.domain.account.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 아무런 값도 갖지않는 의미 없는 객체의 생성을 막음.
@DynamicInsert
//@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
//@Table(name = "user")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long userSeq;

    @Column(nullable = false, length = 45)
    private String userId;

    @Column(nullable = false, length = 45)
    private String userName;

    @Column(length = 200)
    private String userImageUrl;

    @Column(updatable = false, nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @CreationTimestamp
    private Timestamp regDtm;

    @Column(nullable = false)
    @ColumnDefault("N")
    private String delYn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Role role;


    private String refreshToken;

    private String deviceToken;

// Builder
    @Builder
    public Account(String userId, String userName, String userImageUrl, Role role, String deviceToken) {
        this.userId = userId;
        this.userName = userName;
        this.userImageUrl = userImageUrl;
        this.role = role;
        this.deviceToken = deviceToken;
        this.delYn = "N";
    }
// modify
    public void modify(String userName, String userImageUrl) {
        this.userName = userName;
        this.userImageUrl = userImageUrl;
    }

    public Account update(String name, String picture){
        this.userName = name;
        this.userImageUrl = picture;

        return this;
    }
    public void login(String refreshToken, String deviceToken) {
        this.refreshToken = refreshToken;
        this.deviceToken = deviceToken;
    }

    public void logout() {
        this.refreshToken = null;
        this.deviceToken = null;
    }

    public void withdraw() {
        this.refreshToken = null;
        this.deviceToken = null;
        this.delYn = "Y";
    }
    public String getRoleKey(){
        return this.role.getKey();
    }

    public String getId() {
        return this.userId;
    }

    public void refresh(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}