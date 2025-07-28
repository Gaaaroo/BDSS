package com.swp.bdss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@EnableAsync
@SpringBootApplication
@EnableWebSecurity
@EnableScheduling
public class BdssApplication {

	public static void main(String[] args) {
		SpringApplication.run(BdssApplication.class, args);
	}

}
