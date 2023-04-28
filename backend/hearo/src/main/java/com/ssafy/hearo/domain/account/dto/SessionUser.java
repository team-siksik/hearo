package com.ssafy.hearo.domain.account.dto;

import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Getter;

import java.io.Serializable;

@Getter
public class SessionUser implements Serializable {
    private String name;
    private String email;
    private String picture;

    public SessionUser(Account account) {
        this.name = account.getNickname();
        this.email = account.getEmail();
        this.picture = account.getImageUrl();
    }
}