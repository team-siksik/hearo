package com.ssafy.hearo.domain.conversation.repository;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ConversationRepository extends JpaRepository <Conversation, Long> {

    List<Conversation> findByAccountAndEndDtmIsNull(Account account);
    Optional<Conversation> findByAccountAndConversationSeq(Account account, long roomSeq);
    Optional<Conversation> findByAccountAndConversationSeqAndEndDtmIsNull(Account account, long roomSeq);

}
