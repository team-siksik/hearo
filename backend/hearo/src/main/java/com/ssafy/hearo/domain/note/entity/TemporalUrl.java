package com.ssafy.hearo.domain.note.entity;

import com.ssafy.hearo.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DynamicInsert
@Table(name = "temporal_url")
public class TemporalUrl {
    @Id
    @GeneratedValue(generator = "temporal_url_id_seq")
    @Column(name="url_seq", nullable = false)
    private Long urlSeq;

    @OneToOne
    @JoinColumn(name = "dialog_seq", nullable = false)
    private Dialog dialog;

    @ManyToOne
    @JoinColumn(name="user_seq", nullable = false)
    private User user;

    @Column(name="url", nullable = false)
    private String url;

    @Column(name="expiration_date", nullable = false)
    private Timestamp expirationDate;
//    modify
    @Builder
    public TemporalUrl(Dialog dialog, User user, String url, Timestamp expirationDate) {
        this.dialog = dialog;
        this.user = user;
        this.url = url;
        this.expirationDate = expirationDate;
    }
// modify
    public void modify(String url, Timestamp expirationDate) {
        this.url = url;
        this.expirationDate = expirationDate;
    }
}