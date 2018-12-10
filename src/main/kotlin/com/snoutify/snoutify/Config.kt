package com.snoutify.snoutify

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class Config {
    @Bean
    fun fakeLibraryService(): FakeLibraryService {
        return FakeLibraryService(albums = listOf(album1, album2, album3))
    }
}