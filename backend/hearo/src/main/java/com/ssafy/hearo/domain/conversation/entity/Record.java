package com.ssafy.hearo.domain.conversation.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.hearo.domain.conversation.entity.Conversation;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.ssafy.hearo.domain.account.entity.Account;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Entity
@NoArgsConstructor
@DynamicInsert
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long recordSeq;

    @ManyToOne
    @JoinColumn(name = "conversationSeq", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "userSeq", nullable = false)
    private Account account;

    @Column(length = 100)
    private String title;

    @Column(length = 500)
    private String memo;

    @Column(length = 500)
    private String recorededFile;

    @Column(length = 500)
    private String clovaFile;

    @Column(nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    @Column(nullable = false)
    private Byte delYn;

    @Builder
    public Record(Long recordSeq, Conversation conversation, Account account, String title, String memo, String recorededFile, String clovaFile, Timestamp modDtm, Byte delYn) {
        this.recordSeq = recordSeq;
        this.conversation = conversation;
        this.account = account;
        this.title = title;
        this.memo = memo;
        this.recorededFile = recorededFile;
        this.clovaFile = clovaFile;
        this.modDtm = modDtm;
        this.delYn = delYn;
    }

    public void modify(String recorededFile, String clovaFile) {
        this.recorededFile = recorededFile;
        this.clovaFile = clovaFile;
    }
}