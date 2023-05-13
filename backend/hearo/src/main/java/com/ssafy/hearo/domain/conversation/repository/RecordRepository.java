package com.ssafy.hearo.domain.conversation.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.entity.Record;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RecordRepository extends JpaRepository <Record, Long> {

    Page<Record> findByAccountOrderByConversation_RegDtmDesc(Account account, Pageable pageable);
    Page<Record> findByAccountAndIsFavoriteOrderByConversation_RegDtmDesc(Account account, byte isFavorite, Pageable pageable);

}
