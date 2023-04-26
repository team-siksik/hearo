package com.ssafy.hearo.domain.setting.entity;

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
@Table(name = "setting")
public class Setting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "setting_seq", nullable = false)
    private Long settingSeq;

    @OneToOne
    @JoinColumn(name="user_seq", nullable = false)
    private Account account;

    @Column(name = "word_size", nullable = false)
    @ColumnDefault("2")
    private Byte wordSize;

    @Column(name="voice_setting", nullable = false)
    @ColumnDefault("1")
    private Byte voiceSetting;

    @Column(name = "dark_mode", nullable = false)
    @ColumnDefault("0")
    private Byte darkMode;

    @Column(name = "main_theme", nullable = false, length = 7)
    @ColumnDefault("#E63E43")
    private String mainTheme;

    @Column(name = "mod_dtm", nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    // builder
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