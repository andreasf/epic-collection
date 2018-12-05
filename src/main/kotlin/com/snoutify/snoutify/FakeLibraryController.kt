package com.snoutify.snoutify

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class FakeLibraryController {

    @GetMapping("/fake/v1/me/tracks")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun tracks(): TracksResponse {
        return TracksResponse(3)
    }

    @GetMapping("/fake/v1/me/albums")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun albums(): AlbumsResponse {
        return AlbumsResponse(2)
    }
}