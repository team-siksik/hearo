package com.ssafy.hearo.domain.conversation.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface RoomRepository extends JpaRepository <Room, Long> {

    List<Room> findByAccountAndEndDtmIsNull(Account account);
    Optional<Room> findByAccountAndRoomSeq(Account account, long roomSeq);
    Optional<Room> findByAccountAndRoomSeqAndEndDtmIsNull(Account account, long roomSeq);

}
