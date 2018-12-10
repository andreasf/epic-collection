package com.snoutify.snoutify

import com.fasterxml.jackson.annotation.JsonProperty

data class ProfileResponse(
        @JsonProperty("display_name")
        val displayName: String,
        val id: String)

data class TracksResponse(val total: Long)

data class PaginatedLibraryAlbums(
        val items: List<LibraryAlbum>,
        val total: Int)

data class LibraryAlbum(val album: AlbumResponse)

data class AlbumResponse(
        val id: String,
        val name: String,
        val artists: List<ArtistResponse>,
        val images: List<ImageResponse>)

data class ArtistResponse(val name: String)

data class ImageResponse(
        val width: Int,
        val height: Int,
        val url: String)