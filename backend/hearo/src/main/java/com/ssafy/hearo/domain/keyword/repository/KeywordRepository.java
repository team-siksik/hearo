package com.ssafy.hearo.domain.keyword.repository;

import com.ssafy.hearo.domain.keyword.entity.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;


public interface KeywordRepository extends JpaRepository <Keyword, Long> {

}
