package com.ssafy.hearo.domain.conversation.service;

import com.ssafy.hearo.domain.account.entity.Account;
import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto.*;
import com.ssafy.hearo.domain.conversation.dto.ConversationResponseDto.*;
import org.springframework.web.multipart.MultipartFile;


public interface ConversationService {

    StartConversationResponseDto startConversation(Account account, StartConversationRequestDto requestDto);

    EndConversationResponseDto endConversation(Account account, long roomSeq);

    long saveConversation(Account account, long conversationSeq, MultipartFile audio, SaveConversationRequestDto requestDto);
}
