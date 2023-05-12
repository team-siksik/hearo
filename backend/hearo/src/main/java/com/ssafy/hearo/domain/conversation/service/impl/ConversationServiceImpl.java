package com.ssafy.hearo.domain.conversation.service.impl;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.dto.ConversationResponseDto.*;
import com.ssafy.hearo.domain.conversation.entity.Keyword;
import com.ssafy.hearo.domain.conversation.entity.KeywordSentence;
import com.ssafy.hearo.domain.conversation.entity.Conversation;
import com.ssafy.hearo.domain.conversation.repository.KeywordRepository;
import com.ssafy.hearo.domain.conversation.repository.KeywordSentenceRepository;
import com.ssafy.hearo.domain.conversation.repository.ConversationRepository;
import com.ssafy.hearo.domain.conversation.service.ConversationService;
import com.ssafy.hearo.global.error.code.ClovaErrorCode;
import com.ssafy.hearo.global.error.code.CommonErrorCode;
import com.ssafy.hearo.global.error.code.ConversationErrorCode;
import com.ssafy.hearo.global.error.code.S3ErrorCode;
import com.ssafy.hearo.global.error.exception.ErrorException;
import com.ssafy.hearo.global.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ConversationServiceImpl implements ConversationService {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private CloseableHttpClient httpClient = HttpClients.createDefault();

    @Value("${clova.invoke-url}")
    private String invokeUrl;
    @Value("${clova.secret-key}")
    private String secretKey;

    private ObjectMapper objectMapper;

    private final DateUtil dateUtil;
    private final KeywordRepository keywordRepository;
    private final KeywordSentenceRepository keywordSentenceRepository;
    private final ConversationRepository conversationRepository;

    @Override
    public void createSituation(CreateSituationRequestDto requestDto) {
        log.info("[createSituation] 상황 키워드 및 문장 생성 시작");

        log.info("[createSituation] 상황 키워드 생성 시작");
        String word = requestDto.getKeyword();
        Keyword keyword = Keyword.builder()
                .keyword(word)
                .build();
        keywordRepository.save(keyword);
        log.info("[createSituation] 상황 키워드 생성 완료 - {}", word);

        log.info("[createSituation] 상황 문장 생성 시작");
        List<String> sentenceList = requestDto.getSentences();
        for (String sentence : sentenceList) {
            KeywordSentence keywordSentence = KeywordSentence.builder()
                    .keyword(keyword)
                    .sentence(sentence)
                    .build();
            keywordSentenceRepository.save(keywordSentence);
            log.info("[createSituation] 상황 문장 생성 완료 - {}", sentence);
        }

        log.info("[createSituation] 상황 키워드 및 문장 생성 완료");
    }

    @Override
    public List<KeywordResponseDto> getSituationKeywordList() {
        log.info("[getSituation] 상황 키워드 목록 조회 시작");
        List<Keyword> keywordList = keywordRepository.findAll();
        List<KeywordResponseDto> result = new ArrayList<>();
        for (Keyword keyword : keywordList) {
            result.add(KeywordResponseDto.builder()
                            .keywordSeq(keyword.getKeywordSeq())
                            .keyword(keyword.getKeyword())
                            .build());
        }
        log.info("[getSituation] 상황 키워드 목록 조회 완료");
        return result;
    }

    @Override
    public List<KeywordSentenceResponseDto> getSituationSentenceList(long keywordSeq) {
        log.info("[getSituationSentenceList] 상황 키워드 문장 목록 조회 시작");
        Keyword keyword = keywordRepository.findById(keywordSeq)
                .orElseThrow(() -> new ErrorException(CommonErrorCode.BAD_REQUEST));
        List<KeywordSentence> sentenceList = keywordSentenceRepository.findByKeyword(keyword);
        List<KeywordSentenceResponseDto> result = new ArrayList<>();
        for (KeywordSentence sentence : sentenceList) {
            result.add(KeywordSentenceResponseDto.builder()
                            .sentenceSeq(sentence.getSentenceSeq())
                            .keywordSentence(sentence.getSentence())
                            .build());
        }
        log.info("[getSituationSentenceList] 상황 키워드 문장 목록 조회 완료");
        return result;
    }

    @Override
    public StartConversationResponseDto startConversation(Account account, StartConversationRequestDto requestDto) {
        log.info("[startConversation] 대화 시작 시작");
        List<Conversation> userConversationList = conversationRepository.findByAccountAndEndDtmIsNull(account);
        if (userConversationList.size() > 0) {
            throw new ErrorException(ConversationErrorCode.CONVERSATION_EXIST);
        }
        log.info("[startConversation] 진행 중 대화 존재 여부 검증 완료");
        Conversation conversation = Conversation.builder()
                .account(account)
                .conversationType(requestDto.getRoomType())
                .build();
        conversationRepository.save(conversation);

        StartConversationResponseDto result = StartConversationResponseDto.builder()
                .roomSeq(conversation.getConversationSeq())
                .regDtm(dateUtil.timestampToString(conversation.getRegDtm()))
                .roomId(account.getEmail() + '-' + requestDto.getRoomType())
                .build();
        log.info("[startConversation] 대화 시작 완료");
        return result;
    }

    @Override
    public EndConversationResponseDto endConversation(Account account, long conversationSeq) {
        log.info("[endConversation] 대화 종료 시작");
        conversationRepository.findByAccountAndConversationSeq(account, conversationSeq)
                .orElseThrow(() -> new ErrorException(ConversationErrorCode.CONVERSATION_NOT_VALID));
        Conversation conversation = conversationRepository.findByAccountAndConversationSeqAndEndDtmIsNull(account, conversationSeq)
                .orElseThrow(() -> new ErrorException(ConversationErrorCode.CONVERSATION_NOT_EXIST));
        log.info("[endConversation] 종료할 대화 존재 여부 검증 완료");
        conversation.end(new Timestamp(System.currentTimeMillis()));

        EndConversationResponseDto result = EndConversationResponseDto.builder()
                .roomSeq(conversation.getConversationSeq())
                .regDtm(dateUtil.timestampToString(conversation.getRegDtm()))
                .endDtm(dateUtil.timestampToString(conversation.getEndDtm()))
                .build();
        log.info("[endConversation] 대화 종료 완료");
        return result;
    }

    @Override
    public void saveConversation(Account account, long conversationSeq, MultipartFile audio) {
        log.info("[saveConversation] 대화 저장 시작");
        log.info("[saveConversation] audio: {}", String.valueOf(audio));

        log.info("[saveConversation] s3에 음성 데이터 업로드 시작");
        Conversation conversation = conversationRepository.findByAccountAndConversationSeq(account, conversationSeq)
                .orElseThrow(() -> new ErrorException(ConversationErrorCode.CONVERSATION_NOT_VALID));
        String regDtm = dateUtil.timestampToString(conversation.getRegDtm());
        String fileUrl = account.getEmail() + "/" + conversationSeq + "/input/" + regDtm + ".wav";
        try {
            ObjectMetadata metadata= new ObjectMetadata();
            metadata.setContentType(audio.getContentType());
            metadata.setContentLength(audio.getSize());
            amazonS3Client.putObject(bucket, fileUrl, audio.getInputStream(), metadata);
        } catch (IOException e) {
            log.info("[saveConversation] s3에 음성 데이터 업로드 실패");
            throw new ErrorException(S3ErrorCode.S3_UPLOAD_FAILED);
        }
        String s3Url = amazonS3Client.getUrl(bucket, fileUrl).toString();
        log.info("[saveConversation] s3에 음성 데이터 업로드 완료 - {}", s3Url);

        log.info("[saveConversation] 클로바 스피치 API 요청");
        HttpPost httpPost = new HttpPost(invokeUrl + "/recognizer/url");
        // header
        Header[] HEADERS = new Header[] {
                new BasicHeader("Accept", "application/json"),
                new BasicHeader("X-CLOVASPEECH-API-KEY", secretKey),
        };
        httpPost.setHeaders(HEADERS);
        // body
        Map<String, Object> body = new HashMap<>();
        body.put("url", s3Url);
        body.put("language", "ko-KR");
        body.put("completion", "sync");
        // request
        HttpEntity httpEntity = new StringEntity(new Gson().toJson(body), ContentType.APPLICATION_JSON);
        httpPost.setEntity(httpEntity);
        try (final CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
            final HttpEntity entity = httpResponse.getEntity();
            String stringResult = EntityUtils.toString(entity, StandardCharsets.UTF_8);
            log.info("[saveConversation] Result: {}", stringResult);

            Object parsedResult = objectMapper.readValue(stringResult, Object.class);
            String jsonResult = objectMapper.writeValueAsString(parsedResult);
            log.info(jsonResult);
        } catch (Exception e) {
            log.info("[saveConversation] 클로바 스피치 API 요청 실패");
            throw new ErrorException(ClovaErrorCode.CLOVA_FAILED);
        }


        log.info("[saveConversation] s3에 결과 데이터 업로드 - 아이디/대화번호/아웃풋");

        log.info("[saveConversation] 대화 저장 완료");

    }

}
