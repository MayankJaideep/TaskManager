package com.Mayank.TaskManager.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.CacheManager;

import java.util.Arrays;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new org.springframework.cache.support.SimpleCacheManager() {{
            setCaches(Arrays.asList(
                new ConcurrentMapCache("tasks")
            ));
        }};
    }
}
