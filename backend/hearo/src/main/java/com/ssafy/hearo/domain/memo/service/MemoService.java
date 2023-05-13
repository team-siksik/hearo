package com.ssafy.hearo.domain.memo.service;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.memo.dto.MemoRequestDto.*;


public interface MemoService {

    void createMemo(Account account, Long recordSeq, CreateMemoRequestDto requestDto);
    void modifyMemo(Account account, Long recordSeq, Long memoSeq, ModifyMemoRequestDto requestDto);
    void deleteMemo(Account account, Long recordSeq, DeleteMemoRequestDto requestDto);
}
