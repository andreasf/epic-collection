package com.snoutify.snoutify

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment

@Configuration
class Config {
    @Bean
    fun fakeLibraryService(environment: Environment): FakeLibraryService {
        val port = environment.getProperty("server.port") ?: "8080"
        return FakeLibraryService(albums = listOf(album1, album2, album3), port = port)
    }
}