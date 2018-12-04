package com.snoutify.snoutify

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class FakeProfileController {
    @GetMapping("/fake/v1/me")
    fun profile(): ProfileResponse {
        return ProfileResponse("Test User", "testuser")
    }
}
