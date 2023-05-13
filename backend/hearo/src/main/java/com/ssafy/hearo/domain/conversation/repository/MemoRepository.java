package com.ssafy.hearo.domain.conversation.repository;

import com.ssafy.hearo.domain.conversation.entity.Memo;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MemoRepository extends JpaRepository <Memo, Long> {

}
