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
@Table(name = "dialog")
public class Dialog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dialog_seq", nullable = false)
    private Long dialogSeq;

    @ManyToOne
    @JoinColumn(name = "user_seq")
    private Account userSeq;

    @Column(name = "recorede_file", nullable = false, length = 500)
    private String recorededFile;

    @Column(name = "clova_file", nullable = false, length = 500)
    private String clovaFile;

    @Column(name="reg_dtm", nullable = false)
    @CreationTimestamp
    private Timestamp regDtm;

    @Column(name="mod_dtm", nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    @Column(name="del_yn", nullable = false)
    private Byte delYn;
    // builder
    @Builder
    public Dialog(Long dialogSeq, Account userSeq, String recorededFile, String clovaFile, Timestamp regDtm, Timestamp modDtm, Byte delYn) {
        this.dialogSeq = dialogSeq;
        this.userSeq = userSeq;
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