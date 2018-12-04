package com.snoutify.snoutify

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class FakeTracksController {

    @GetMapping("/fake/v1/me/tracks")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun tracks(): TracksResponse {
        return TracksResponse(3)
    }
}