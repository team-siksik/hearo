package com.ssafy.hearo.domain.keyword.repository;

import com.ssafy.hearo.domain.keyword.entity.Keyword;
import com.ssafy.hearo.domain.keyword.entity.KeywordSentence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface KeywordSentenceRepository extends JpaRepository <KeywordSentence, Long> {

    List<KeywordSentence> findByKeyword(Keyword keyword);

}
