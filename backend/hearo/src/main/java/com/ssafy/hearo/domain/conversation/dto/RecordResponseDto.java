package com.ssafy.hearo.domain.conversation.dto;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.entity.Conversation;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

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
}
