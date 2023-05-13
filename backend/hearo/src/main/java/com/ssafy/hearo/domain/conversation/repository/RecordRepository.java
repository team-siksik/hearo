package com.ssafy.hearo.domain.conversation.repository;

import com.ssafy.hearo.domain.conversation.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RecordRepository extends JpaRepository <Record, Long> {

}
