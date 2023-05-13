package com.ssafy.hearo.domain.conversation.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.entity.Memo;
import com.ssafy.hearo.domain.conversation.entity.Record;
import com.ssafy.hearo.domain.setting.entity.FrequentSentence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface MemoRepository extends JpaRepository <Memo, Long> {

    List<Memo> findByAccountAndRecordAndDelYn(Account account, Record record, byte delYn);

}
