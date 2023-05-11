package com.ssafy.hearo.domain.conversation.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.Id;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Entity
@NoArgsConstructor
@DynamicInsert
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long conversationSeq;

    @ManyToOne
    @JoinColumn(name = "userSeq", nullable = false)
    private Account account;

    @Column(nullable = false, length = 5)
    private String conversationType;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp regDtm;

    @Column()
    private Timestamp endDtm;

    @Builder
    public Conversation(Account account, String conversationType) {
        this.account = account;
        this.conversationType = conversationType;
    }

    public void end(Timestamp timestamp) {
        this.endDtm = timestamp;
    }

}
