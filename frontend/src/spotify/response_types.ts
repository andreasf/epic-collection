export interface PaginatedLibraryAlbums {
    items: LibraryAlbum[],
    total: number;
}

export interface LibraryAlbum {
    album: ApiAlbum;
}

export interface PaginatedTracks {
    items: Track[],
    next: string | null;
    total: number;
}

export interface Track {
    id: string;
}

export interface ApiAlbum {
    artists: Artist[];
    id: string;
    name: string;
    images: Image[];
    tracks: PaginatedTracks;
}

export interface Image {
    width: number;
    height: number;
    url: string;
}

export interface Artist {
    name: string;
}

export interface UserProfile {
    display_name: string;
}

export interface CreatePlaylistResponse {
    id: string;
}