package com.ssafy.hearo.domain.setting.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Getter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Entity
@NoArgsConstructor
@DynamicInsert
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long settingSeq;

    @OneToOne
    @JoinColumn(name="userSeq", nullable = false)
    private Account account;

    @Column(nullable = false)
    @ColumnDefault("2")
    private Byte fontSize;

    @Column(nullable = false)
    @ColumnDefault("1")
    private Byte voiceSetting;

    @Column(nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    @Builder
    public Setting(Account account) {
        this.account = account;
        this.fontSize = (byte)2;
        this.voiceSetting = (byte)1;
    }

    public void modify(Byte fontSize, Byte voiceSetting) {
        this.fontSize = fontSize;
        this.voiceSetting = voiceSetting;
    }


}