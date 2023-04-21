package com.ssafy.hearo.domain.setting.entity;

import com.ssafy.hearo.domain.user.entity.User;
import lombok.Getter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
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
    private User userSeq;

    @Column(name = "word_size", nullable = false)
    private Byte wordSize;

    @Column(name="voice_setting", nullable = false)
    private Byte voiceSetting; // 해당 voice종류에 따라 확장해야 할 경우 존재할수도

    @Column(name = "dark_mode", nullable = false)
    private Byte darkMode;

    @Column(name = "main_theme", nullable = false, length = 7)
    @ColumnDefault("#E63E43")
    private String mainTheme;

    @Column(name = "mod_dtm", nullable = false)
    private Timestamp modDtm;
// builder
    @Builder
    public Setting(Long settingSeq, User userSeq, Byte wordSize, Byte voiceSetting, Byte darkMode, String mainTheme, Timestamp modDtm) {
        this.settingSeq = settingSeq;
        this.userSeq = userSeq;
        this.wordSize = wordSize;
        this.voiceSetting = voiceSetting;
        this.darkMode = darkMode;
        this.mainTheme = mainTheme;
        this.modDtm = modDtm;
    }

// modify
    public void modify(Byte wordSize, Byte voiceSetting, Byte darkMode, String mainTheme) {
        this.wordSize = wordSize;
        this.voiceSetting = voiceSetting;
        this.darkMode = darkMode;
        this.mainTheme = mainTheme;
    }


}