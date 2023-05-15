package com.ssafy.hearo.domain.conversation.service.impl;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.google.gson.Gson;
import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.dto.ConversationResponseDto.*;
import com.ssafy.hearo.domain.conversation.entity.*;
import com.ssafy.hearo.domain.conversation.repository.*;
import com.ssafy.hearo.domain.conversation.service.ConversationService;
import com.ssafy.hearo.domain.memo.dto.MemoRequestDto.*;
import com.ssafy.hearo.domain.memo.entity.Memo;
import com.ssafy.hearo.domain.memo.repository.MemoRepository;
import com.ssafy.hearo.domain.record.entity.Record;
import com.ssafy.hearo.domain.record.repository.RecordRepository;
import com.ssafy.hearo.global.error.code.ClovaErrorCode;
import com.ssafy.hearo.global.error.code.ConversationErrorCode;
import com.ssafy.hearo.global.error.code.RecordErrorCode;
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
import ws.schild.jave.Encoder;
import ws.schild.jave.MultimediaObject;
import ws.schild.jave.encode.AudioAttributes;
import ws.schild.jave.encode.EncodingAttributes;
import ws.schild.jave.info.MultimediaInfo;
import ws.schild.jave.progress.EncoderProgressListener;

import javax.transaction.Transactional;
import java.io.*;
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

    private final DateUtil dateUtil;
    private final ConversationRepository conversationRepository;
    private final RecordRepository recordRepository;
    private final MemoRepository memoRepository;


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
    public long saveConversation(Account account, long conversationSeq, MultipartFile audio, SaveConversationRequestDto requestDto) {
        log.info("[saveConversation] 대화 저장 시작");
        log.info("[saveConversation] audio: {}", String.valueOf(audio));

        log.info("[saveConversation] s3에 원본 음성 데이터 업로드 시작");
        Conversation conversation = conversationRepository.findByAccountAndConversationSeq(account, conversationSeq)
                .orElseThrow(() -> new ErrorException(ConversationErrorCode.CONVERSATION_NOT_VALID));
        String regDtm = dateUtil.timestampToString(conversation.getRegDtm());
        String inputFileUrl_test = account.getEmail() + "/" + conversationSeq + "/input/" + regDtm + ".webm";
        try {
            ObjectMetadata metadata= new ObjectMetadata();
            metadata.setContentType(audio.getContentType());
            metadata.setContentLength(audio.getSize());
            amazonS3Client.putObject(bucket, inputFileUrl_test, audio.getInputStream(), metadata);
        } catch (IOException e) {
            log.info("[saveConversation] s3에 원본 음성 데이터 업로드 실패");
            log.info(e.getMessage());
            throw new ErrorException(S3ErrorCode.S3_UPLOAD_FAILED);
        }
        String inputS3Url_test = amazonS3Client.getUrl(bucket, inputFileUrl_test).toString();
        log.info("[saveConversation] s3에 원본 음성 데이터 업로드 완료 - {}", inputS3Url_test);

        log.info("[saveConversation] webm -> wav 음성 데이터 변환 시작");
        File target;
        try {
            File source = File.createTempFile("source", null);
            audio.transferTo(source);
//            File source = new File("sample.webm");
            target = new File("sample.wav");

            //Audio Attributes
            AudioAttributes audioAttributes = new AudioAttributes();
            audioAttributes.setCodec("pcm_s16le");
            audioAttributes.setBitRate(16000);
            audioAttributes.setChannels(2);
            audioAttributes.setSamplingRate(8000);

            //Encoding attributes
            EncodingAttributes attrs = new EncodingAttributes();
            attrs.setOutputFormat("wav");
            attrs.setAudioAttributes(audioAttributes);

            //Encode
            Encoder encoder = new Encoder();
            Listener listener = new Listener();
            encoder.encode(new MultimediaObject(source), target, attrs, listener);
        } catch (Exception e) {
            log.info("[saveConversation] webm -> wav 음성 데이터 변환 실패");
            log.info(e.getMessage());
            throw new ErrorException(RecordErrorCode.AUDIO_CONVERT_FAILED);
        }
        log.info("[saveConversation] webm -> wav 음성 데이터 변환 완료");

        log.info("[saveConversation] s3에 음성 데이터 업로드 시작");
//        Conversation conversation = conversationRepository.findByAccountAndConversationSeq(account, conversationSeq)
//                .orElseThrow(() -> new ErrorException(ConversationErrorCode.CONVERSATION_NOT_VALID));
//        String regDtm = dateUtil.timestampToString(conversation.getRegDtm());
        String inputFileUrl = account.getEmail() + "/" + conversationSeq + "/input/" + regDtm + ".wav";
        try {
            ObjectMetadata metadata= new ObjectMetadata();
            metadata.setContentType(audio.getContentType());
            metadata.setContentLength(audio.getSize());
            amazonS3Client.putObject(bucket, inputFileUrl, new FileInputStream(target), metadata);
        } catch (IOException e) {
            log.info("[saveConversation] s3에 음성 데이터 업로드 실패");
            log.info(e.getMessage());
            throw new ErrorException(S3ErrorCode.S3_UPLOAD_FAILED);
        }
        String inputS3Url = amazonS3Client.getUrl(bucket, inputFileUrl).toString();
        log.info("[saveConversation] s3에 음성 데이터 업로드 완료 - {}", inputS3Url);

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
        body.put("url", inputS3Url);
        body.put("language", "ko-KR");
        body.put("completion", "sync");
        // request
        HttpEntity httpEntity = new StringEntity(new Gson().toJson(body), ContentType.APPLICATION_JSON);
        httpPost.setEntity(httpEntity);

        String stringResult;
        try (final CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
            final HttpEntity entity = httpResponse.getEntity();
            stringResult = EntityUtils.toString(entity, StandardCharsets.UTF_8);
            log.info("[saveConversation] Result: {}", stringResult);
        } catch (Exception e) {
            log.info("[saveConversation] 클로바 스피치 API 요청 실패");
            throw new ErrorException(ClovaErrorCode.CLOVA_FAILED);
        }

        log.info("[saveConversation] s3에 결과 데이터 업로드 시작");
        String outputFileUrl = account.getEmail() + "/" + conversationSeq + "/output/" + regDtm + ".json";
        InputStream inputStreamResult = new ByteArrayInputStream(stringResult.getBytes(StandardCharsets.UTF_8));
        ObjectMetadata metadata= new ObjectMetadata();
        metadata.setContentType("application/json");
        metadata.setContentLength(stringResult.getBytes(StandardCharsets.UTF_8).length);
        amazonS3Client.putObject(bucket, outputFileUrl, inputStreamResult, metadata);
        String outputS3Url = amazonS3Client.getUrl(bucket, outputFileUrl).toString();
        log.info("[saveConversation] s3에 결과 데이터 업로드 완료 - {}", outputS3Url);

        log.info("[saveConversation] record 생성 시작");
        Record record = Record.builder()
                .conversation(conversation)
                .account(account)
                .title(regDtm)
                .recorededFile(inputS3Url)
                .clovaFile(outputS3Url)
                .build();
        recordRepository.save(record);
        log.info("[saveConversation] record 생성 완료 - {}", record.getTitle());

        log.info("[saveConversation] memo 생성 시작");
        List<CreateMemoRequestDto> conversationMemoList = requestDto.getMemo();
        for (CreateMemoRequestDto conversationMemo : conversationMemoList) {
            Memo memo = Memo.builder()
                    .record(record)
                    .conversation(conversation)
                    .account(account)
                    .content(conversationMemo.getContent())
                    .timestamp(conversationMemo.getTimestamp())
                    .build();
            memoRepository.save(memo);
            log.info("[saveConversation] memo 생성 완료 - {}", memo.getContent());
        }

        log.info("[saveConversation] 대화 저장 완료");
        return record.getRecordSeq();
    }

    class Listener implements EncoderProgressListener
    {

        @Override
        public void sourceInfo(MultimediaInfo info) {}

        @Override
        public void progress(int permil) {
            if (permil < 1000) {
                try {
                    Thread.sleep(10000); // 1초 대기
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
            log.info("[saveConversation] 진행도: {}", permil);
        }

        @Override
        public void message(String message) {}
    }
}
