export interface PaginatedLibraryAlbums {
    href: string;
    items: LibraryAlbum[],
    limit: number;
    offset: number;
    total: number;
    next: string;
    previous: string;
}

export interface LibraryAlbum {
    album: ApiAlbum;
}

export interface PaginatedLibraryTracks {
    href: string;
    items: LibraryTrack[],
    limit: number;
    offset: number;
    total: number;
    next: string;
    previous: string;
}

export interface LibraryTrack {
    added_at: string;
    track: Track;
}

export interface Track {
    album: ApiAlbum;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
}

export interface ApiAlbum {
    artists: Artist[];
    id: string;
    name: string;
    images: Image[];
    tracks: PaginatedLibraryTracks;
}

export interface Image {
    width: number;
    height: number;
    url: string;
}

export interface Artist {
    href: string;
    external_urls: ExternalUrls;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface UserProfile {
    display_name: string;
}
