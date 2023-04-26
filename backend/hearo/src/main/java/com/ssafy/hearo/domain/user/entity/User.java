package com.ssafy.hearo.domain.user.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DynamicInsert
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_seq", nullable = false)
    private Long userSeq;

    @Column(name="user_id", nullable = false, length = 45)
    private String userId;

    @Column(name="user_name", nullable = false, length = 45)
    private String userName;

    @Column(name="user_image_url", length = 200)
    private String userImageUrl;

    @Column(name="reg_dtm", updatable = false, nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @CreationTimestamp
    private Timestamp regDtm;

    @Column(name="del_yn", nullable = false, columnDefinition = "TINYINT", length = 1 )
    private Byte delYn;
// Builder
    @Builder
    public User(Long userSeq, String userId, String userName, String userImageUrl, Timestamp regDtm, Byte delYn) {
        this.userSeq = userSeq;
        this.userId = userId;
        this.userName = userName;
        this.userImageUrl = userImageUrl;
        this.regDtm = regDtm;
        this.delYn = delYn;
    }
// modify
    public void modify(String userName, String userImageUrl) {
        this.userName = userName;
        this.userImageUrl = userImageUrl;
    }
}