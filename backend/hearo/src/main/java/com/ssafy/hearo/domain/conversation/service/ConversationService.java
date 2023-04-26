package com.ssafy.hearo.domain.conversation.service;

import com.ssafy.hearo.domain.conversation.dto.ConversationRequestDto;

public interface ConversationService {

    void createSituation(ConversationRequestDto.CreateSituationRequestDto requestDto);
}
