package com.ssafy.hearo.domain.conversation.service;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.dto.ConversationResponseDto.*;

import java.util.List;

public interface ConversationService {

    void createSituation(CreateSituationRequestDto requestDto);

    List<KeywordResponseDto> getSituationKeywordList();

    List<KeywordSentenceResponseDto> getSituationSentenceList(long keywordSeq);

    RoomResponseDto startConversation(Account account);

    RoomResponseDto endConversation(Account account, long roomSeq);
}
