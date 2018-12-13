package com.snoutify.snoutify

data class Album(
        val id: String,
        val name: String,
        val artists: List<ArtistResponse>,
        val images: List<ImageResponse>,
        val tracks: List<Track>)

val album1 = Album(
        id = "album-1-id",
        name = "album-1-name",
        artists = listOf(
                ArtistResponse("artist-1"),
                ArtistResponse("artist-2")
        ),
        images = listOf(ImageResponse(480, 480, "/images/album-1.png")),
        tracks = listOf(
                Track("album-1-track-1"),
                Track("album-1-track-2"),
                Track("album-1-track-3"))
)

val album1Response = AlbumResponse(
        album1.id,
        album1.name,
        album1.artists,
        album1.images,
        PaginatedTracks(album1.tracks, null))

val album2 = Album(
        id = "album-2-id",
        name = "album-2-name",
        artists = listOf(
                ArtistResponse("artist-2"),
                ArtistResponse("artist-3"),
                ArtistResponse("artist-4")
        ),
        images = listOf(ImageResponse(480, 480, "/images/album-2.png")),
        tracks = listOf(Track("album-2-track-1"))
)

val album2Response = AlbumResponse(
        album2.id,
        album2.name,
        album2.artists,
        album2.images,
        PaginatedTracks(album2.tracks, null))


val album3 = Album(
        id = "album-3-id",
        name = "album-3-name",
        artists = listOf(ArtistResponse("artist-1")),
        images = listOf(ImageResponse(320, 240, "/images/album-3.png")),
        tracks = listOf(Track("album-3-track-1"))
)

val paginatedAlbum = Album(
        id = "album-4-id",
        name = "album-4-name",
        artists = listOf(ArtistResponse("artist-1"), ArtistResponse("artist-2")),
        images = listOf(ImageResponse(480, 480, "/images/album-4.png")),
        tracks = (1..101).map { Track("album-4-track-$it") })

val paginatedAlbumPage1 = AlbumResponse(
        paginatedAlbum.id,
        paginatedAlbum.name,
        paginatedAlbum.artists,
        paginatedAlbum.images,
        PaginatedTracks(
                items = (1..50).map { Track("album-4-track-$it") },
                next = "http://localhost:8080/v1/albums/album-4-id/tracks?offset=50&limit=50",
                total = paginatedAlbum.tracks.size))

val paginatedAlbumTracksPage2 = PaginatedTracks(
        items = (51..100).map { Track("album-4-track-$it") },
        next = "http://localhost:8080/v1/albums/album-4-id/tracks?offset=100&limit=50",
        total = paginatedAlbum.tracks.size)
