import {PaginatedLibraryAlbums} from "../response_types";

export const meAlbumsResponse = {
    "items": [
        {
            "album": {
                "id": "album-1-id",
                "name": "album-1-name",
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
                            "id": "album-1-track-1"
                        },
                        {
                            "id": "album-1-track-2"
                        },
                        {
                            "id": "album-1-track-3"
                        }
                    ],
                    "total": 3,
                    "next": null,
                }
            }
        }
    ],
    "total": 3
} as PaginatedLibraryAlbums;
