package com.ssafy.hearo.domain.user.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
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

//    @Column(name="del_yn", nullable = false, columnDefinition = "TINYINT", length = 1 )
//    @ColumnDefault("0")
//    private Byte delYn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Role role;

// Builder
    @Builder
    public User(String userId, String userName, String userImageUrl, Role role) {
        this.userId = userId;
        this.userName = userName;
        this.userImageUrl = userImageUrl;
        this.role = role;
    }
// modify
    public void modify(String userName, String userImageUrl) {
        this.userName = userName;
        this.userImageUrl = userImageUrl;
    }

    public User update(String name, String picture){
        this.userName = name;
        this.userImageUrl = picture;

        return this;
    }

    public String getRoleKey(){
        return this.role.getKey();
    }
}