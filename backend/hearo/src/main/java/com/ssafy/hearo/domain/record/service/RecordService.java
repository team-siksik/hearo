package com.ssafy.hearo.domain.record.service;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.record.dto.RecordRequestDto.*;
import com.ssafy.hearo.domain.record.dto.RecordResponseDto.*;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface RecordService {

    List<GetRecordListResponseDto> getRecordList(Account account, Pageable pageable);
    List<GetRecordListResponseDto> getFavoriteRecordList(Account account, Pageable pageable);
    GetRecordResponseDto getRecord(Account account, Long recordSeq);
    void modifyRecordTitle(Account account, Long recordSeq, ModifyRecordTitleRequestDto requestDto);
    void modifyRecordFavorite(Account account, Long recordSeq, ModifyRecordFavoriteRequestDto requestDto);
    void deleteRecord(Account account, DeleteRecordRequestDto requestDto);
}
