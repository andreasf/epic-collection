package com.snoutify.snoutify

import org.springframework.stereotype.Service
import kotlin.math.max
import kotlin.math.min

val maxTracksPerPage = 50

@Service
class FakeLibraryService(private var albums: List<Album>, private val port: String) {
    private var crash = false

    fun getAlbum(offset: Int): PaginatedLibraryAlbums {
        if (crash) {
            throw RuntimeException("crash requested")
        }

        if (offset > albums.size - 1) {
            return PaginatedLibraryAlbums(emptyList(), albums.size)
        }

        return PaginatedLibraryAlbums(
                listOf(LibraryAlbum(firstPageOf(albums[offset]))),
                albums.size)
    }

    fun getAlbumTracks(albumId: String, offset: Int): PaginatedTracks {
        val album = albums.filter { album -> album.id == albumId }.first()
        val morePages = album.tracks.size > offset + maxTracksPerPage
        val items = album.tracks.subList(offset, min(album.tracks.size, offset + maxTracksPerPage))
        val nextUrl = if (morePages) tracksUrlFor(album, offset + maxTracksPerPage) else null

        return PaginatedTracks(items, nextUrl, album.tracks.size)
    }

    fun setCrash(crash: Boolean) {
        this.crash = crash
    }

    fun deleteAlbum(albumId: String) {
        albums = albums.filter { album -> album.id != albumId }
    }

    fun setAlbums(newAlbums: List<Album>) {
        this.albums = newAlbums
    }

    fun getAlbums(): List<Album> {
        return albums
    }

    private fun firstPageOf(album: Album): AlbumResponse {
        val paginated = album.tracks.size > maxTracksPerPage
        val items = album.tracks.subList(0, min(album.tracks.size, maxTracksPerPage))
        val nextUrl = if (paginated) tracksUrlFor(album) else null

        return AlbumResponse(
                album.id,
                album.name,
                album.artists,
                album.images,
                PaginatedTracks(items, nextUrl, album.tracks.size))
    }

    private fun tracksUrlFor(album: Album, offset: Int = maxTracksPerPage): String {
        return "http://localhost:$port/v1/albums/${album.id}/tracks?offset=$offset&limit=$maxTracksPerPage"
    }
}
