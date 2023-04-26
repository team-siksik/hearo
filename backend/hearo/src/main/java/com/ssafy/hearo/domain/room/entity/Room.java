package com.ssafy.hearo.domain.room.entity;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.Id;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
//@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long roomSeq;

    @Column(nullable = false)
    private Integer roomCode;

    @Column( nullable = false)
    private Long userSeq;

    @Column( nullable = false)
    private Integer headcount;

    @Column(nullable = false)
    private Timestamp regDtm;

    private Timestamp endDtm;
}