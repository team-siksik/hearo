package com.ssafy.hearo.domain.room.entity;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.Id;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="room_seq", nullable = false)
    private Long roomSeq;

    @Column(name="room_code", nullable = false)
    private Integer roomCode;

    @Column(name="user_seq", nullable = false)
    private Long userSeq;

    @Column(name="headcount", nullable = false)
    private Integer headcount;

    @Column(name="reg_dtm", nullable = false)
    private Timestamp regDtm;

    @Column(name="end_dtm")
    private Timestamp endDtm;
}