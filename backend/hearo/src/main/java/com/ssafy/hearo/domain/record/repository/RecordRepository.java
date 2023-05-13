package com.ssafy.hearo.domain.record.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.record.entity.Record;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RecordRepository extends JpaRepository <Record, Long> {

    Page<Record> findByAccountAndDelYnOrderByConversation_RegDtmDesc(Account account, Byte delYn, Pageable pageable);
    Page<Record> findByAccountAndIsFavoriteAndDelYnOrderByConversation_RegDtmDesc(Account account, byte isFavorite, byte delYn, Pageable pageable);
    Optional<Record> findByAccountAndRecordSeqAndDelYn(Account account, Long recordSeq, byte delYn);

}
