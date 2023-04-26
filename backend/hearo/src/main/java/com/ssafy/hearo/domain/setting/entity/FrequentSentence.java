package com.ssafy.hearo.domain.setting.entity;

import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@DynamicInsert
@Entity
@Table(name = "frequent_sentence")
public class FrequentSentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "frequent_seq", nullable = false)
    private long frequentSeq;

    @ManyToOne
    @JoinColumn(name = "user_seq", nullable = false)
    private Account account;

    @Column(name = "sentence", nullable = false, length = 200)
    private String sentence;

    @Column(name = "reg_dtm", nullable = false)
    @CreationTimestamp
    private Timestamp regDtm;

    @Column(name = "mod_dtm", nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    @Column(name = "del_yn", columnDefinition = "TINYINT", length = 1)
    private byte delYn;

    // builder
    public FrequentSentence(String sentence, Byte delYn) {
        this.sentence = sentence;
        this.delYn = delYn;
    }
    // modify
    public void modify(String sentence) {
        this.sentence = sentence;
    }
}