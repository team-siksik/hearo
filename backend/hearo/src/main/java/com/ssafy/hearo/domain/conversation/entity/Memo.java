package com.ssafy.hearo.domain.conversation.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
public class Memo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long memoSeq;

    @ManyToOne
    @JoinColumn(name = "recordSeq", nullable = false)
    private Record record;

    @ManyToOne
    @JoinColumn(name = "conversationSeq", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "userSeq", nullable = false)
    private Account account;

    @Column(length = 500)
    private String content;

    @Column(nullable = false)
    private Long timestamp;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp regDtm;

    @Column(nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    @Column(nullable = false)
    private Byte delYn;

    @Builder
    public Memo(Record record, Conversation conversation, Account account, String content, Long timestamp) {
        this.record = record;
        this.conversation = conversation;
        this.account = account;
        this.content = content;
        this.timestamp = timestamp;
    }

    public void modify(String content) {
        this.content = content;
    }

    public void delete() {
        this.delYn = 1;
    }
}