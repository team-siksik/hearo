package com.ssafy.hearo.domain.conversation.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Getter
@Entity
@NoArgsConstructor
@DynamicInsert
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class KeywordSentence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long sentenceSeq;

    @ManyToOne
    @JoinColumn(name = "keywordSeq", nullable = false)
    private Keyword keyword;

    @Column(nullable = false, length = 100)
    private String keywordSentence;

    @Builder
    public KeywordSentence(Keyword keyword, String keywordSentence) {
        this.keyword = keyword;
        this.keywordSentence = keywordSentence;
    }

}