package com.ssafy.hearo.global.config.security;

import java.util.Map;

public class GoogleOAuth2UserInfo extends OAuthUserInfo {

    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }


    @Override
    public String getemail() {
        return (String) attributes.get("sub");
    }

    @Override
    public String getname() {
        return (String) attributes.get("name");
    }

    @Override
    public String getImageUrl() {
        return (String) attributes.get("picture");
    }
}
