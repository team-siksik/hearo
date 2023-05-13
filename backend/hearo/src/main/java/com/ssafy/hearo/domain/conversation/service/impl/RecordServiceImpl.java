package com.ssafy.hearo.domain.conversation.service.impl;

import com.google.gson.*;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.ConversationResponseDto.StartConversationResponseDto;
import com.ssafy.hearo.domain.conversation.dto.RecordResponseDto.*;
import com.ssafy.hearo.domain.conversation.entity.Conversation;
import com.ssafy.hearo.domain.conversation.entity.Record;
import com.ssafy.hearo.domain.conversation.repository.RecordRepository;
import com.ssafy.hearo.domain.conversation.service.RecordService;
import com.ssafy.hearo.domain.setting.dto.SettingResponseDto;
import com.ssafy.hearo.domain.setting.entity.FrequentSentence;
import com.ssafy.hearo.global.error.code.ConversationErrorCode;
import com.ssafy.hearo.global.error.code.RecordErrorCode;
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
import javax.sound.sampled.UnsupportedAudioFileException;
import javax.transaction.Transactional;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RecordServiceImpl implements RecordService {

    private final DateUtil dateUtil;
    private final RecordRepository recordRepository;

    private String getRecodingTime(String recordedFile) {
        URL recordUrl;
        long durationInSeconds;
        try {
            recordUrl = new URL(recordedFile);
            AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(recordUrl);
            AudioFormat format = audioInputStream.getFormat();
            long audioFileLength = audioInputStream.getFrameLength();
            float frameRate = format.getFrameRate();
            durationInSeconds = (long)(audioFileLength / frameRate);
        } catch (Exception e) {
            throw new ErrorException(RecordErrorCode.RECORD_TIME_CALCULATION_FAILED);
        }
        String minute = String.format("%02d", durationInSeconds / 60);
        String second = String.format("%02d", durationInSeconds % 60);
        return minute + ":" + second;
    }

    private String getPreview(String clovaFile) {
        URL jsonUrl;
        String preview = null;
        try {
            jsonUrl = new URL(clovaFile);
            BufferedReader reader = new BufferedReader(new InputStreamReader(jsonUrl.openStream()));
            JsonParser jsonParser = new JsonParser();
            JsonObject jsonObject = jsonParser.parse(reader).getAsJsonObject();
            JsonArray segmentsArray = jsonObject.getAsJsonArray("segments");
            JsonElement firstSegmentElement = segmentsArray.get(0);
            if (firstSegmentElement != null && firstSegmentElement.isJsonObject()) {
                JsonObject firstSegmentObject = firstSegmentElement.getAsJsonObject();
                preview = firstSegmentObject.get("text").getAsString();
            }
        } catch (Exception e) {
            throw new ErrorException(RecordErrorCode.GET_RECORD_PREVIEW_FAILED);
        }
        return preview;
    }

    @Override
    public List<GetRecordListResponseDto> getRecordList(Account account, Pageable pageable) {
        log.info("[getRecordList] 기록 목록 조회 시작");
        Page<Record> recordList = recordRepository.findByAccountOrderByConversation_RegDtmDesc(account, pageable);
        List<GetRecordListResponseDto> result = new ArrayList<>();
        for (Record record : recordList) {
            log.info("[getRecordList] 음성 길이 계산 시작");
            String recordingTime = getRecodingTime(record.getRecorededFile());
            log.info("[getRecordList] 음성 길이 계산 성공 - {}", recordingTime);

            log.info("[getRecordList] 미리보기 텍스트 불러오기 시작");
            String preview = getPreview(record.getClovaFile());
            log.info("[getRecordList] 미리보기 텍스트 불러오기 성공 - {}", preview);

            result.add(GetRecordListResponseDto.builder()
                    .recordSeq(record.getRecordSeq())
                    .conversationSeq(record.getConversation().getConversationSeq())
                    .title(record.getTitle())
                    .recordingTime(recordingTime)
                    .preview(preview)
                    .isFavorite(record.getIsFavorite())
                    .regDtm(dateUtil.timestampToString(record.getConversation().getRegDtm()))
                    .modDtm(dateUtil.timestampToString(record.getModDtm()))
                    .build());
        }
        log.info("[getRecordList] 기록 목록 조회 완료");
        return result;
    }

    @Override
    public List<GetRecordListResponseDto> getFavoriteRecordList(Account account, Pageable pageable) {
        log.info("[getFavoriteRecordList] 즐겨찾는 기록 목록 조회 시작");
        Page<Record> recordList = recordRepository.findByAccountAndIsFavoriteOrderByConversation_RegDtmDesc(account, (byte)1, pageable);
        List<GetRecordListResponseDto> result = new ArrayList<>();
        for (Record record : recordList) {
            log.info("[getFavoriteRecordList] 음성 길이 계산 시작");
            String recordingTime = getRecodingTime(record.getRecorededFile());
            log.info("[getFavoriteRecordList] 음성 길이 계산 성공 - {}", recordingTime);

            log.info("[getFavoriteRecordList] 미리보기 텍스트 불러오기 시작");
            String preview = getPreview(record.getClovaFile());
            log.info("[getFavoriteRecordList] 미리보기 텍스트 불러오기 성공 - {}", preview);

            result.add(GetRecordListResponseDto.builder()
                    .recordSeq(record.getRecordSeq())
                    .conversationSeq(record.getConversation().getConversationSeq())
                    .title(record.getTitle())
                    .recordingTime(recordingTime)
                    .preview(preview)
                    .isFavorite(record.getIsFavorite())
                    .regDtm(dateUtil.timestampToString(record.getConversation().getRegDtm()))
                    .modDtm(dateUtil.timestampToString(record.getModDtm()))
                    .build());
        }
        log.info("[getFavoriteRecordList] 즐겨찾는 기록 목록 조회 완료");
        return result;
    }
}
