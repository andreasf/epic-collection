package com.snoutify.snoutify

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class FakeLibraryController(private val fakeLibraryService: FakeLibraryService) {
    @GetMapping("/fake/v1/me/tracks")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun tracks(): ResponseEntity<TracksResponse> {
        return ResponseEntity.ok(TracksResponse(3))
    }

    @GetMapping("/fake/v1/me/albums")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun albums(@RequestParam limit: Int, @RequestParam offset: Int): ResponseEntity<PaginatedLibraryAlbums> {
        if (limit != 1) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }

        return try {
            ResponseEntity.ok(fakeLibraryService.getAlbum(offset))

        } catch (e: RuntimeException) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }
}