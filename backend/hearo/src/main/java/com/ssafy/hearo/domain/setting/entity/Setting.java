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
//@Table(name = "setting")
public class Setting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long settingSeq;

    @OneToOne
    @JoinColumn(name="user_seq", nullable = false)
    private Account account;

    @Column( nullable = false)
    @ColumnDefault("2")
    private Byte wordSize;

    @Column( nullable = false)
    @ColumnDefault("1")
    private Byte voiceSetting; // 해당 voice종류에 따라 확장해야 할 경우 존재할수도

    @Column( nullable = false)
    @ColumnDefault("0")
    private Byte darkMode;

    @Column( nullable = false, length = 7)
    @ColumnDefault("#E63E43")
    private String mainTheme;

    @Column( nullable = false)
    @UpdateTimestamp
    private Timestamp modDtm;

    // builder
    @Builder
    public Setting(Long settingSeq, Account account, Byte wordSize, Byte voiceSetting, Byte darkMode, String mainTheme, Timestamp modDtm) {
        this.settingSeq = settingSeq;
        this.account = account;
        this.wordSize = wordSize;
        this.voiceSetting = voiceSetting;
        this.darkMode = darkMode;
        this.mainTheme = mainTheme;
        this.modDtm = modDtm;
    }

    public void modify(Byte wordSize, Byte voiceSetting, Byte darkMode, String mainTheme) {
        this.wordSize = wordSize;
        this.voiceSetting = voiceSetting;
        this.darkMode = darkMode;
        this.mainTheme = mainTheme;
    }


}