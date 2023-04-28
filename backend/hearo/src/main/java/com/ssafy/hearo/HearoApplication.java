package com.ssafy.hearo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class HearoApplication {

	public static void main(String[] args) {
		SpringApplication.run(HearoApplication.class, args);
	}

}
