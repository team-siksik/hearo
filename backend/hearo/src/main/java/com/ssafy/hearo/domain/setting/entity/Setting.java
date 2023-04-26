package com.ssafy.hearo.domain.setting.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Getter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
    private Byte wordSize;

    @Column(nullable = false)
    @ColumnDefault("1")
    private Byte voiceSetting;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Byte darkMode;

    @Column(nullable = false, length = 7)
    @ColumnDefault("#E63E43")
    private String mainTheme;

    @Column(nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    @Builder
    public Setting(Byte wordSize, Byte voiceSetting, Byte darkMode, String mainTheme) {
        this.wordSize = wordSize;
        this.voiceSetting = voiceSetting;
        this.darkMode = darkMode;
        this.mainTheme = mainTheme;
    }

    public void modify(Byte wordSize, Byte voiceSetting, Byte darkMode, String mainTheme) {
        this.wordSize = wordSize;
        this.voiceSetting = voiceSetting;
        this.darkMode = darkMode;
        this.mainTheme = mainTheme;
    }


}