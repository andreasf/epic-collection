package com.snoutify.snoutify

import org.springframework.stereotype.Service

@Service
class FakeLibraryService(var albums: List<AlbumResponse>) {
    private var crash = false

    fun getAlbum(offset: Int): PaginatedLibraryAlbums {
        if (crash) {
            throw RuntimeException("crash requested")
        }

        if (offset > albums.size - 1) {
            return PaginatedLibraryAlbums(emptyList(), albums.size)
        }

        return PaginatedLibraryAlbums(
                listOf(LibraryAlbum(albums[offset])),
                albums.size)
    }

    fun setCrash(crash: Boolean) {
        this.crash = crash
    }
}
