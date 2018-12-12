import {ApiClient} from "./ApiClient";
import {RandomChoice} from "../RandomChoice";
import {Artist} from "./model";

const maxLibrarySize = 10000;

export class LibraryService {
    private apiClient: ApiClient;
    private randomChoice: RandomChoice;
    private albumCount: number;
    private visitedAlbums: number[] = [];
    private selectedAlbums: SelectedAlbums = {};

    constructor(apiClient: ApiClient, randomChoice: RandomChoice) {
        this.apiClient = apiClient;
        this.randomChoice = randomChoice;
    }

    public clearSelection() {
        this.visitedAlbums = [];
        this.selectedAlbums = {};
    }

    public async commit(): Promise<void> {
        const name = `Epic Collection`;
        const description = `Tracks removed from library`;
        const playlistId = await this.apiClient.createPlaylist(name, description);

        await this.apiClient.addToPlaylist(playlistId, this.getSelectedTrackIds());

        await this.apiClient.deleteAlbums(this.getSelectedAlbumIds());
    }

    public async getStats(): Promise<LibraryStats> {
        const [albums, tracks] = await Promise.all([
            this.getAlbumCount(false),
            this.apiClient.getTrackCount()
        ]);

        this.albumCount = albums;

        return {
            albums,
            tracks,
            remaining: maxLibrarySize - albums - tracks
        } as LibraryStats;
    }

    public getUsername(): Promise<string> {
        return this.apiClient.getUsername();
    }

    public async getRandomAlbum(): Promise<Album> {
        const albumCount = await this.getAlbumCount();
        const offset = this.randomChoice.randomInt(albumCount, this.visitedAlbums);
        const album = await this.apiClient.getAlbumByOffset(offset);

        return {
            name: album.name,
            id: album.id,
            cover: album.images[0].url,
            artists: this.formatArtists(album.artists),
            tracks: album.tracks.items.map(track => track.id),
            offset,
        };
    }

    public keepAlbum(album: Album) {
        this.markVisited(album.offset);
    }

    public selectForRemoval(album: Album) {
        this.markVisited(album.offset);
        this.selectedAlbums[album.id] = album;
    }

    public getSelectedCount(): number {
        let count = 0;

        for (const key of Object.keys(this.selectedAlbums)) {
            count += 1 + this.selectedAlbums[key].tracks.length;
        }

        return count;
    }

    private async getAlbumCount(cache: boolean = true): Promise<number> {
        if (!this.albumCount || !cache) {
            this.albumCount = await this.apiClient.getAlbumCount();
        }

        return Promise.resolve(this.albumCount);
    }

    private formatArtists(artists: Artist[]): string {
        if (artists.length === 1) {
            return artists[0].name;
        }

        const names = artists.map(artist => artist.name);
        const artistN = names.pop();
        const artistsNMinus1 = names.join(", ");
        return [artistsNMinus1, artistN].join(" & ");
    }

    private markVisited(offset: number) {
        // don't modify this.visitedAlbums directly, because ts-mockito currently does *not* make a copy of arguments
        // at call time.
        const visitedAlbums = Array.from(this.visitedAlbums);
        visitedAlbums.push(offset);
        this.visitedAlbums = visitedAlbums;
    }

    private getSelectedTrackIds(): string[] {
        const selectedTracks = [];

        for (const albumId of Object.keys(this.selectedAlbums)) {
            for (const track of this.selectedAlbums[albumId].tracks) {
                selectedTracks.push(track);
            }
        }

        return selectedTracks;
    }

    private getSelectedAlbumIds(): string[] {
        return Object.keys(this.selectedAlbums);
    }
}

export interface LibraryStats {
    albums: number;
    tracks: number;
    remaining: number;
}

export interface Album {
    name: string;
    artists: string;
    cover: string;
    id: string;
    tracks: string[];
    offset: number;
}

interface SelectedAlbums {
    [id: string]: Album;
}