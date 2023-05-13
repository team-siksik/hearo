package com.ssafy.hearo.domain.memo.service.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.memo.dto.MemoRequestDto.*;
import com.ssafy.hearo.domain.memo.entity.Memo;
import com.ssafy.hearo.domain.memo.repository.MemoRepository;
import com.ssafy.hearo.domain.memo.service.MemoService;
import com.ssafy.hearo.domain.record.dto.RecordRequestDto.DeleteRecordRequestDto;
import com.ssafy.hearo.domain.record.dto.RecordRequestDto.ModifyRecordFavoriteRequestDto;
import com.ssafy.hearo.domain.record.dto.RecordRequestDto.ModifyRecordTitleRequestDto;
import com.ssafy.hearo.domain.record.dto.RecordResponseDto.GetRecordListResponseDto;
import com.ssafy.hearo.domain.record.dto.RecordResponseDto.GetRecordMemoResponseDto;
import com.ssafy.hearo.domain.record.dto.RecordResponseDto.GetRecordResponseDto;
import com.ssafy.hearo.domain.record.entity.Record;
import com.ssafy.hearo.domain.record.repository.RecordRepository;
import com.ssafy.hearo.domain.record.service.RecordService;
import com.ssafy.hearo.domain.setting.dto.SettingRequestDto;
import com.ssafy.hearo.domain.setting.entity.FrequentSentence;
import com.ssafy.hearo.global.error.code.MemoErrorCode;
import com.ssafy.hearo.global.error.code.RecordErrorCode;
import com.ssafy.hearo.global.error.code.SettingErrorCode;
import com.ssafy.hearo.global.error.exception.ErrorException;
import com.ssafy.hearo.global.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.transaction.Transactional;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MemoServiceImpl implements MemoService {

    private final DateUtil dateUtil;
    private final MemoRepository memoRepository;
    private final RecordRepository recordRepository;

    @Override
    public void createMemo(Account account, Long recordSeq, CreateMemoRequestDto requestDto) {
        log.info("[createMemo] 메모 생성 시작");
        Record record = recordRepository.findByAccountAndRecordSeqAndDelYn(account, recordSeq, (byte)0)
                .orElseThrow(() -> new ErrorException(RecordErrorCode.RECORD_NOT_EXIST));
        Memo memo = Memo.builder()
                .record(record)
                .conversation(record.getConversation())
                .account(account)
                .content(requestDto.getContent())
                .timestamp(requestDto.getTimestamp())
                .build();
        memoRepository.save(memo);
        log.info("[createMemo] 메모 생성 완료");
    }

    public void modifyMemo(Account account, Long recordSeq, Long memoSeq, ModifyMemoRequestDto requestDto) {
        log.info("[modifyMemo] 메모 수정 시작");
        Record record = recordRepository.findByAccountAndRecordSeqAndDelYn(account, recordSeq, (byte)0)
                .orElseThrow(() -> new ErrorException(RecordErrorCode.RECORD_NOT_EXIST));
        Memo memo = memoRepository.findByAccountAndRecordAndMemoSeqAndDelYn(account, record, memoSeq, (byte)0)
                .orElseThrow(() -> new ErrorException(MemoErrorCode.MEMO_NOT_EXIST));
        memo.modify(requestDto.getContent());
        log.info("[modifyMemo] 메모 수정 완료");
    }

    public void deleteMemo(Account account, Long recordSeq, DeleteMemoRequestDto requestDto) {
        log.info("[deleteMemo] 메모 삭제 시작");
        List<Long> deleteMemoSeqList = requestDto.getDeleteMemoSeqList();
        for (Long deleteMemoSeq : deleteMemoSeqList) {
            Record record = recordRepository.findByAccountAndRecordSeqAndDelYn(account, recordSeq, (byte)0)
                    .orElseThrow(() -> new ErrorException(RecordErrorCode.RECORD_NOT_EXIST));
            Memo memo = memoRepository.findByAccountAndRecordAndMemoSeqAndDelYn(account, record, deleteMemoSeq, (byte)0)
                    .orElseThrow(() -> new ErrorException(MemoErrorCode.MEMO_NOT_EXIST));
            log.info("[deleteMemo] 메모 삭제 - {}", memo.getMemoSeq());
            memo.delete();
        }
        log.info("[deleteMemo] 메모 삭제 완료");
    }
}
