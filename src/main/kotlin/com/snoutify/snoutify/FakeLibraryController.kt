package com.snoutify.snoutify

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class FakeLibraryController {
    private var crash = false

    @GetMapping("/fake/v1/me/tracks")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun tracks(): ResponseEntity<TracksResponse> {
        if (crash) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }

        return ResponseEntity.ok(TracksResponse(3))
    }

    @GetMapping("/fake/v1/me/albums")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun albums(): ResponseEntity<AlbumsResponse> {
        if (crash) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }

        return ResponseEntity.ok(AlbumsResponse(2))
    }

    fun setCrash(crash: Boolean) {
        this.crash = crash
    }
}