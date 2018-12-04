package com.snoutify.snoutify

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class FakeTracksController {
    @GetMapping("/fake/v1/me/tracks")
    fun tracks(): TracksResponse {
        return TracksResponse(2342)
    }
}