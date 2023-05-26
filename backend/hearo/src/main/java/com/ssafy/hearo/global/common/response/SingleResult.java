package com.ssafy.hearo.global.common.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SingleResult<T> extends Result {

    private T data;

}
