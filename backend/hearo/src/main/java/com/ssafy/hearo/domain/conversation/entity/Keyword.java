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
@Table(name = "keyword")
public class Keyword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "keyword_seq", nullable = false)
    private Long keywordSeq;

    @Column(name = "keyword", nullable = false, length = 100)
    private String keyword;
    //builder
    @Builder
    public Keyword(Long keywordSeq, String keyword) {
        this.keywordSeq = keywordSeq;
        this.keyword = keyword;
    }
//    modify
    public void modify(String keyword) {
        this.keyword = keyword;
    }
}