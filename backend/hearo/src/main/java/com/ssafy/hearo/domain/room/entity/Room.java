package com.ssafy.hearo.domain.room.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.Id;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Entity
@NoArgsConstructor
@DynamicInsert
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long roomSeq;

    @ManyToOne
    @JoinColumn(name = "userSeq", nullable = false)
    private Account account;

    @Column(nullable = false)
    private Timestamp regDtm;

    @Column()
    private Timestamp endDtm;

    @Column(columnDefinition = "TINYINT", length = 1)
    private byte saveCondition;
}