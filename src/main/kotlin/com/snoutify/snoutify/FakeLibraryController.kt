package com.snoutify.snoutify

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class FakeLibraryController(private val fakeLibraryService: FakeLibraryService) {
    @GetMapping("/fake/v1/me/tracks")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun tracks(): ResponseEntity<TracksResponse> {
        val trackCount = this.fakeLibraryService.getAlbums()
                .map { it.tracks.size }
                .reduce { totalTracks, albumTracks -> totalTracks + albumTracks }

        return ResponseEntity.ok(TracksResponse(trackCount))
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

    @GetMapping("/fake/v1/albums/{albumId}/tracks")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun albumTracks(@PathVariable albumId: String, @RequestParam offset: Int): PaginatedTracks {
        return fakeLibraryService.getAlbumTracks(albumId, offset)
    }

    @PostMapping("/fake/v1/me/playlists")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization", "Content-Type"])
    fun createPlaylist(): ResponseEntity<CreatePlaylistResponse> {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(CreatePlaylistResponse("new-playlist-id"))
    }

    @PostMapping("/fake/v1/playlists/{id}/tracks")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization", "Content-Type"])
    fun addToPlaylist(@PathVariable id: String): ResponseEntity<CreatePlaylistResponse> {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build()
    }

    @DeleteMapping("/fake/v1/me/albums")
    @CrossOrigin(allowCredentials = "true", allowedHeaders = ["Authorization"])
    fun deleteAlbums(@RequestParam ids: String): ResponseEntity<Void> {
        val idList = ids.split(',')

        for (id in idList) {
            fakeLibraryService.deleteAlbum(id)
        }

        return ResponseEntity
                .ok()
                .build()
    }
}