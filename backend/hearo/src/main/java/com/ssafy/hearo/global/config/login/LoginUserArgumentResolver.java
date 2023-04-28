package com.ssafy.hearo.global.config.login;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.global.annotation.LoginUser;
import com.ssafy.hearo.global.config.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import com.ssafy.hearo.domain.account.repository.AccountRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoginUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final JwtService jwtService;
    private final AccountRepository accountRepository;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(LoginUser.class) != null;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        String token = webRequest.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            log.debug("[resolveArgument] 잘못된 토큰입니다.");
            return null;
        }

        String jwt = token.substring(7);
        String email = jwtService.getEmail(jwt);
        if (email == null) {
            log.debug("[resolveArgument] 잘못된 토큰입니다.");
            return null;
        }

        Account account = accountRepository.findByEmail(email).orElse(null);
        log.info("[LoginUser] {}", account);

        return account;
    }
}