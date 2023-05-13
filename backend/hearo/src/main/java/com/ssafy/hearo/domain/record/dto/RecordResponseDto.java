package com.ssafy.hearo.domain.record.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class RecordResponseDto {

    @Getter
    @Builder
    public static class GetRecordListResponseDto {

        private long recordSeq;
        private long conversationSeq;
        private String title;
        private String recordingTime;
        private String preview;
        private Byte isFavorite;
        private String regDtm;
        private String modDtm;
    }

    @Getter
    @Builder
    public static class GetRecordMemoResponseDto {
        private Long memoSeq;
        private String content;
        private Long timestamp;
    }

    @Getter
    @Builder
    public static class GetRecordResponseDto {

        private long recordSeq;
        private long conversationSeq;
        private String title;
        private Byte isFavorite;
        private String clovaFile;
        private String recordedFileUrl;
        private String recordingTime;
        private String regDtm;
        private String modDtm;
        private List<GetRecordMemoResponseDto> memoList;
    }
}
