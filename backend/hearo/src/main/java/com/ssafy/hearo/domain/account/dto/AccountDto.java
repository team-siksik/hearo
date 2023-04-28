package com.ssafy.hearo.domain.account.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class AccountDto {
    private String id;
    private String email;
    private String name;
    private String picture;
    private String password;
    private Boolean verified_email;
    private String locale;
    private String given_name;
}
