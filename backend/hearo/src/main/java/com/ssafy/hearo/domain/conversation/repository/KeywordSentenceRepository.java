package com.ssafy.hearo.domain.conversation.repository;

import com.ssafy.hearo.domain.conversation.entity.KeywordSentence;
import org.springframework.data.jpa.repository.JpaRepository;


public interface KeywordSentenceRepository extends JpaRepository <KeywordSentence, Long> {

}
