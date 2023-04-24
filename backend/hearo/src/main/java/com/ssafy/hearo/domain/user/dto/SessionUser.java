package com.ssafy.hearo.domain.user.dto;

import com.ssafy.hearo.domain.user.entity.User;
import lombok.Getter;

import java.io.Serializable;

@Getter
public class SessionUser implements Serializable {
    private String name;
    private String email;
    private String picture;

    public SessionUser(User user) {
        this.name = user.getUserName();
        this.email = user.getUserId();
        this.picture = user.getUserImageUrl();
    }
}