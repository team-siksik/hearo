package com.ssafy.hearo.domain.setting.service.impl;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.account.repository.AccountRepository;
import com.ssafy.hearo.domain.setting.dto.SettingRequestDto.*;
import com.ssafy.hearo.domain.setting.dto.SettingResponseDto.*;
import com.ssafy.hearo.domain.setting.entity.FrequentSentence;
import com.ssafy.hearo.domain.setting.entity.Setting;
import com.ssafy.hearo.domain.setting.repository.FrequentSentenceRepository;
import com.ssafy.hearo.domain.setting.repository.SettingRepository;
import com.ssafy.hearo.domain.setting.service.SettingService;
import com.ssafy.hearo.global.error.code.CommonErrorCode;
import com.ssafy.hearo.global.error.exception.ErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SettingServiceImpl implements SettingService {

    private final SettingRepository settingRepository;
    private final FrequentSentenceRepository frequentSentenceRepository;


    @Override
    public SettingInfoResponseDto getSetting(Account account) {
        log.info("[getSetting] 설정 조회 시작");
        Setting setting = settingRepository.findByAccount(account)
                        .orElseThrow(() -> new ErrorException(CommonErrorCode.RESOURCE_NOT_FOUND));
        log.info("[getSetting] 설정 조회 완료");
        return SettingInfoResponseDto.builder()
                .settingSeq(setting.getSettingSeq())
                .userSeq(setting.getAccount().getUserSeq())
                .fontSize(setting.getFontSize())
                .voiceSetting(setting.getVoiceSetting())
                .build();
    }

    @Override
    public void modifySetting(Account account, ModifySettingRequestDto requestDto) {
        log.info("[modifySetting] 설정 수정 시작");
        Setting setting = settingRepository.findByAccount(account)
                .orElseThrow(() -> new ErrorException(CommonErrorCode.RESOURCE_NOT_FOUND));
        byte fontSize = requestDto.getFontSize();
        byte voiceSetting = requestDto.getVoiceSetting();
        setting.modify(fontSize, voiceSetting);
        log.info("[modifySetting] 설정 수정 완료");
    }

    @Override
    public List<FrequentResponseDto> getFrequentList(Account account) {
        log.info("[getFrequentList] 자주 쓰는 말 목록 조회 시작");
        List<FrequentSentence> frequentSentenceList = frequentSentenceRepository.findByAccountAndDelYn(account, (byte) 0);
        List<FrequentResponseDto> result = new ArrayList<>();
        for (FrequentSentence frequentSentence : frequentSentenceList) {
            result.add(FrequentResponseDto.builder()
                            .frequentSeq(frequentSentence.getFrequentSeq())
                            .sentence(frequentSentence.getSentence())
                            .build());
        }
        log.info("[getFrequentList] 자주 쓰는 말 목록 조회 완료");
        return result;
    }

    @Override
    public void createFrequent(Account account, FrequentRequestDto requestDto) {
        log.info("[creatFrequent] 자주 쓰는 말 생성 시작");
        String sentence = requestDto.getSentence();
        FrequentSentence frequentSentence = FrequentSentence.builder()
                .account(account)
                .sentence(sentence)
                .delYn((byte)0)
                .build();
        frequentSentenceRepository.save(frequentSentence);
        log.info("[creatFrequent] 자주 쓰는 말 생성 완료");
    }

    @Override
    public void modifyFrequent(Account account, long frequentSeq, FrequentRequestDto frequentRequestDto) {
        log.info("[modifyFrequent] 자주 쓰는 말 수정 시작");

        FrequentSentence frequentSentence = frequentSentenceRepository.findByAccountAndFrequentSeqAndDelYn(account, frequentSeq, (byte)0)
                .orElseThrow(() -> new ErrorException(CommonErrorCode.BAD_REQUEST));

        String sentence = frequentSentence.getSentence();

        frequentSentence.modify(sentence);

        log.info("[modifyFrequent] 자주 쓰는 말 수정 완료");
    }

    @Override
    public void removeFrequent(Account account, long frequentSeq) {
        log.info("[removeFrequent] 자주 쓰는 말 삭제 시작");

        FrequentSentence frequentSentence = frequentSentenceRepository.findByAccountAndFrequentSeqAndDelYn(account, frequentSeq, (byte)0)
                .orElseThrow(() -> new ErrorException(CommonErrorCode.BAD_REQUEST));

        frequentSentence.remove((byte)1);

        log.info("[removeFrequent] 자주 쓰는 말 삭제 완료");
    }

}
