package com.ssafy.hearo.domain.memo.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.memo.entity.Memo;
import com.ssafy.hearo.domain.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface MemoRepository extends JpaRepository <Memo, Long> {

    List<Memo> findByAccountAndRecordAndDelYn(Account account, Record record, byte delYn);

}
