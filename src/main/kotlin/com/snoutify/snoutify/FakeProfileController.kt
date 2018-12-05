package com.snoutify.snoutify

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class FakeProfileController {
    private var crash = false

    @GetMapping("/fake/v1/me")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun profile(): ResponseEntity<ProfileResponse> {
        if (crash) {
            return ResponseEntity.status(500).build()
        }

        return ResponseEntity.ok(ProfileResponse("Test User", "testuser"))
    }

    fun setCrash(crash: Boolean) {
        this.crash = crash
    }
}
