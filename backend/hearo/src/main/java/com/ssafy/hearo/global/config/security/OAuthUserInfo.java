package com.ssafy.hearo.global.config.security;

import java.util.Map;

public abstract class OAuthUserInfo {

    protected Map<String, Object> attributes;

    public OAuthUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public abstract String getname();

    public abstract String getemail();

    public abstract String getImageUrl();


}
