package com.writeit.rest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(
    basePackages = "com.writeit.rest",
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = "com\\.writeit\\.rest\\.documents\\..*"
    )
)
@EntityScan(basePackages = "com.writeit.rest.content")
@EnableJpaRepositories(basePackages = "com.writeit.rest.content")
public class WriteItRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(WriteItRestApplication.class, args);
    }
}
