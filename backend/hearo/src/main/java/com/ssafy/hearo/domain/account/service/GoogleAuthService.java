package com.ssafy.hearo.domain.account.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.hearo.domain.account.dto.response.SignInResponseDto;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.entity.Role;
import com.ssafy.hearo.domain.setting.entity.Setting;
import com.ssafy.hearo.domain.setting.repository.SettingRepository;
import com.ssafy.hearo.global.config.jwt.JwtService;
import com.ssafy.hearo.global.error.code.CommonErrorCode;
import com.ssafy.hearo.global.error.exception.ErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.ssafy.hearo.domain.account.dto.AccountDto;
import com.ssafy.hearo.domain.account.repository.AccountRepository;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Optional;
import org.springframework.http.HttpEntity;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class GoogleAuthService {

    private final AccountRepository accountRepository;
    private final SettingRepository settingRepository;

    @Autowired
    private JwtService jwtService;


    public SignInResponseDto getUserInfo(String oAuthToken) {
        String GOOGLE_USERINFO_REQUEST_URL="https://www.googleapis.com/oauth2/v1/userinfo";
        RestTemplate restTemplate = new RestTemplate();
        log.info("Start getUserInfo");
        //header에 accessToken을 담는다.
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization","Bearer "+oAuthToken);

        //HttpEntity를 하나 생성해 헤더를 담아서 restTemplate으로 구글과 통신하게 된다.
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(headers);
        ResponseEntity<String> response=restTemplate.exchange(GOOGLE_USERINFO_REQUEST_URL, HttpMethod.GET,request,String.class);
        log.info("response  도달");
        if (response.getStatusCode() == HttpStatus.OK) {
            // response body에서 유저 정보 추출
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                AccountDto user = objectMapper.readValue(response.getBody(), AccountDto.class);

                // user가 이미 등록되어 있는지 확인
                Optional<Account> existingUser = accountRepository.findByEmailAndDelYn(user.getEmail(), "0");
                if (existingUser.isPresent()) {
                    Account account = existingUser.get();
                    account.setnickname(user.getName());
                    account.setImageUrl(user.getPicture());
                    accountRepository.save(account);
                } else {
                    Account account = Account.builder()
                            .email(user.getEmail())
                            .nickname(user.getName())
                            .imageUrl(user.getPicture())
                            .userRole(Role.USER)
                            .userPassword(user.getPassword())
                            .delYn("0")
                            .build();
                    accountRepository.save(account);

                    Setting setting = Setting.builder()
                            .account(account)
                            .build();
                    settingRepository.save(setting);
                }

                String Jwt = jwtService.login(user.getEmail());
                log.info("Jwt : {}", Jwt);
                Optional<Account> account = accountRepository.findByEmailAndDelYn(user.getEmail(),"0");
                return SignInResponseDto.builder()
                        .accessToken(Jwt)
                        .nickname(account.get().getNickname())
                        .profileImg(account.get().getImageUrl())
                        .email(account.get().getEmail())
                        .delYn(account.get().getDelYn())
                        .role(account.get().getUserRole())
                        .build();

            } catch (IOException e) {
                log.info(String.valueOf(e));
                // JSON 파싱에 실패했을 경우 예외 처리
                throw new ErrorException(CommonErrorCode.RESOURCE_NOT_FOUND);
            }
        } else {
            // 에러가 발생한 경우 로그를 남기고 error 리턴
            // 이후 클라이언트에서 예외 처리를 해주어야 합니다.
            log.error("Failed to retrieve user info from Google API. Status code: {}", response.getStatusCode());
            throw new ErrorException(CommonErrorCode.BAD_REQUEST);
        }
    }

}
