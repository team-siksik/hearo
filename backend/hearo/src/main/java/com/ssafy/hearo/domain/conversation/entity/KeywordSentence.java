package com.ssafy.hearo.domain.conversation.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DynamicInsert
@Table(name = "keyword_sentence")
public class KeywordSentence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sentence_seq", nullable = false)
    private Long sentenceSeq;

    @ManyToOne
    @JoinColumn(name = "keyword_seq", nullable = false)
    private Keyword keywordSeq;

    @Column(name = "keyword_sentence", nullable = false, length = 100)
    private String keywordSentence;
//    builder
    @Builder
    public KeywordSentence(Long sentenceSeq, Keyword keywordSeq, String keywordSentence) {
        this.sentenceSeq = sentenceSeq;
        this.keywordSeq = keywordSeq;
        this.keywordSentence = keywordSentence;
    }
    //modify
    public void modify(String keywordSentence) {
        this.keywordSentence = keywordSentence;
    }
}