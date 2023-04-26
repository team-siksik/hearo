package com.ssafy.hearo.domain.room.entity;

import com.ssafy.hearo.domain.account.entity.Account;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "room_log")
public class RoomLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="room_log_seq", nullable = false)
    private Long roomLogSeq;

    @ManyToOne
    @JoinColumn(name = "room_seq")
    private Room roomSeq;

    @ManyToOne
    @JoinColumn(name = "user_seq")
    private Account accountSeq;

    @Column(name="save_condition", nullable = false)
    @ColumnDefault("1")
    private Integer saveCondition;
// builder
    public RoomLog(Room roomSeq, Account accountSeq, Integer saveCondition) {
        this.roomSeq = roomSeq;
        this.accountSeq = accountSeq;
        this.saveCondition = saveCondition;
    }
// modify
    public void modify(Integer saveCondition) {
        this.saveCondition = saveCondition;
    }
}