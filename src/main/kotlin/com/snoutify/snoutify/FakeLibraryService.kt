package com.snoutify.snoutify

import org.springframework.stereotype.Service

@Service
class FakeLibraryService(private var albums: List<AlbumResponse>) {
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

    fun deleteAlbum(albumId: String) {
        albums = albums.filter { album -> album.id != albumId }
    }

    fun setAlbums(newAlbums: List<AlbumResponse>) {
        this.albums = newAlbums
    }

    fun getAlbums(): List<AlbumResponse> {
        return albums
    }
}
