package com.ssafy.hearo.domain.conversation.repository;

import com.ssafy.hearo.domain.conversation.entity.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;


public interface KeywordRepository extends JpaRepository <Keyword, Long> {

}
