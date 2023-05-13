package com.ssafy.hearo.domain.conversation.service;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.RecordResponseDto.*;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface RecordService {

    List<GetRecordListResponseDto> getRecordList(Account account, Pageable pageable);
    List<GetRecordListResponseDto> getFavoriteRecordList(Account account, Pageable pageable);
    GetRecordResponseDto getRecord(Account account, Long recordSeq);
}
