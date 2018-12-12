package com.snoutify.snoutify

val album1 = AlbumResponse(
        id = "album-1-id",
        name = "album-1-name",
        artists = listOf(
                ArtistResponse("artist-1"),
                ArtistResponse("artist-2")
        ),
        images = listOf(ImageResponse(480, 480, "/images/album-1.png")),
        tracks = PaginatedTracks(listOf(
                Track("album-1-track-1"),
                Track("album-1-track-2"),
                Track("album-1-track-3")
        ))
)

val album2 = AlbumResponse(
        id = "album-2-id",
        name = "album-2-name",
        artists = listOf(
                ArtistResponse("artist-2"),
                ArtistResponse("artist-3"),
                ArtistResponse("artist-4")
        ),
        images = listOf(ImageResponse(480, 480, "/images/album-2.png")),
        tracks = PaginatedTracks(listOf(Track("album-2-track-1")))
)

val album3 = AlbumResponse(
        id = "album-3-id",
        name = "album-3-name",
        artists = listOf(ArtistResponse("artist-1")),
        images = listOf(ImageResponse(320, 240, "/images/album-3.png")),
        tracks = PaginatedTracks(listOf(Track("album-3-track-1")))
)