package com.ssafy.hearo.domain.note.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import com.ssafy.hearo.domain.account.entity.Account;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
//@Table(name = "dialog")
public class Dialog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long dialogSeq;

    @ManyToOne
    @JoinColumn(name = "user_seq")
    private Account account;

    @Column(nullable = false, length = 500)
    private String recorededFile;

    @Column(nullable = false, length = 500)
    private String clovaFile;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp regDtm;

    @Column(nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    @Column(nullable = false)
    private Byte delYn;
    // builder
    @Builder
    public Dialog(Long dialogSeq, Account account, String recorededFile, String clovaFile, Timestamp regDtm, Timestamp modDtm, Byte delYn) {
        this.dialogSeq = dialogSeq;
        this.account = account;
        this.recorededFile = recorededFile;
        this.clovaFile = clovaFile;
        this.regDtm = regDtm;
        this.modDtm = modDtm;
        this.delYn = delYn;
    }
    // modify
    public void modify(String recorededFile, String clovaFile) {
        this.recorededFile = recorededFile;
        this.clovaFile = clovaFile;
    }
}