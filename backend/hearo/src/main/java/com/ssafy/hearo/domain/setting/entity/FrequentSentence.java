package com.ssafy.hearo.domain.setting.entity;

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
public class FrequentSentence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long frequentSeq;

    @ManyToOne
    @JoinColumn(name = "userSeq", nullable = false)
    private Account account;

    @Column( nullable = false, length = 200)
    private String sentence;

    @Column( nullable = false)
    @CreationTimestamp
    private Timestamp regDtm;

    @Column(nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    @Column( columnDefinition = "TINYINT", length = 1)
    private Byte delYn;

    @Builder
    public FrequentSentence(Account account, String sentence, Byte delYn) {
        this.account = account;
        this.sentence = sentence;
        this.delYn = delYn;
    }
    public void modify(String sentence) {
        this.sentence = sentence;
    }

    public void remove(byte delYn) {
        this.delYn = (byte)1;
    }

}