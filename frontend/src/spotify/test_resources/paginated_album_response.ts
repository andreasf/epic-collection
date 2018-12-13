import {PaginatedLibraryAlbums, PaginatedTracks} from "../response_types";


export const paginatedMeAlbumsResponse = {
    "items": [
        {
            "album": {
                "id": "album-4-id",
                "name": "album-4-name",
                "artists": [
                    {"name": "artist-1"},
                    {"name": "artist-2"}
                ],
                "images": [
                    {"width": 480, "height": 480, "url": "/images/album-1.png"}
                ],
                "tracks": {
                    "items": [
                        {
                            "id": "album-4-track-1"
                        },
                        {
                            "id": "album-4-track-2"
                        },
                        {
                            "id": "album-4-track-3"
                        }
                    ],
                    "total": 5,
                    "next": "http://localhost:3000/v1/albums/album-4-id/tracks?offset=3&limit=1"
                }
            }
        }
    ],
    "total": 1
} as PaginatedLibraryAlbums;

export const albumTracksPage2Response = {
    "items": [
        {
            "id": "album-4-track-4"
        }
    ],
    "total": 5,
    "next": "http://localhost:3000/v1/albums/album-4-id/tracks?offset=4&limit=1"
} as PaginatedTracks;

export const albumTracksPage3Response = {
    "items": [
        {
            "id": "album-4-track-5"
        }
    ],
    "total": 5,
    "next": null
} as PaginatedTracks;