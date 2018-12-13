import {ApiClient} from "./ApiClient";
import {RandomChoice} from "../util/RandomChoice";
import {Artist} from "./response_types";
import {DateProvider} from "../util/DateProvider";

const maxLibrarySize = 10000;
const maxTracksPerAddRequest = 100;
const maxAlbumsPerDeleteRequest = 50;

export class LibraryService {
    private apiClient: ApiClient;
    private randomChoice: RandomChoice;
    private albumCount: number;
    private visitedAlbums: number[] = [];
    private selectedAlbums: SelectedAlbums = {};
    private dateProvider: DateProvider;

    constructor(apiClient: ApiClient, randomChoice: RandomChoice, dateProvider: DateProvider) {
        this.apiClient = apiClient;
        this.randomChoice = randomChoice;
        this.dateProvider = dateProvider;
    }

    public clearSelection() {
        this.visitedAlbums = [];
        this.selectedAlbums = {};
    }

    public async commit(): Promise<void> {
        const timestamp = this.timestamp();
        const name = `Epic Collection ${timestamp}`;
        const description = `Tracks moved from library on ${timestamp}`;
        const playlistId = await this.apiClient.createPlaylist(name, description);

        for (const trackUris of this.splitList(this.getSelectedTrackUris(), maxTracksPerAddRequest)) {
            await this.apiClient.addToPlaylist(playlistId, trackUris);
        }

        for (const albumIds of this.splitList(this.getSelectedAlbumIds(), maxAlbumsPerDeleteRequest)) {
            await this.apiClient.deleteAlbums(albumIds);
        }

        this.clearSelection();
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

    public selectForMoving(album: Album) {
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

    private getSelectedTrackUris(): string[] {
        const selectedTracks = [];

        for (const albumId of Object.keys(this.selectedAlbums)) {
            for (const trackId of this.selectedAlbums[albumId].tracks) {
                selectedTracks.push("spotify:track:" + trackId);
            }
        }

        return selectedTracks;
    }

    private getSelectedAlbumIds(): string[] {
        return Object.keys(this.selectedAlbums);
    }

    private splitList(list: string[], maxItems: number): string[][] {
        const lists: string[][] = [];

        for (let offset = 0; offset < list.length; offset += maxItems) {
            lists.push(list.slice(offset, offset + maxItems));
        }

        return lists;
    }

    private timestamp() {
        const dateFormat = new Intl.DateTimeFormat(navigator.language, {
            hour12: false,
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

        return dateFormat.format(this.dateProvider.newDate());
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