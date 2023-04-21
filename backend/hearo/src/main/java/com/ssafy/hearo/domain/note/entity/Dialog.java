package com.ssafy.hearo.domain.note.entity;

import lombok.Getter;
import lombok.Setter;

import com.ssafy.hearo.domain.user.entity.User;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "dialog")
public class Dialog {
    private Long dialogSeq;

    @ManyToOne
    @JoinColumn(name = "user_seq")
    private User userSeq;

}