package com.snoutify.snoutify

val album1 = AlbumResponse(
        id = "album-1-id",
        name = "album-1-name",
        artists = listOf(
                ArtistResponse("artist-1"),
                ArtistResponse("artist-2")
        ),
        images = listOf(ImageResponse(480, 480, "/images/album-1.png"))
)

val album2 = AlbumResponse(
        id = "album-2-id",
        name = "album-2-name",
        artists = listOf(
                ArtistResponse("artist-2"),
                ArtistResponse("artist-3"),
                ArtistResponse("artist-4")
        ),
        images = listOf(ImageResponse(320, 240, "/images/album-2.jpg"))
)

val album3 = AlbumResponse(
        id = "album-3-id",
        name = "album-3-name",
        artists = listOf(ArtistResponse("artist-1")),
        images = listOf(ImageResponse(320, 240, "/images/album-3.jpg"))
)