import {ApiClient} from "./ApiClient";
import {RandomChoice} from "../RandomChoice";
import {Artist} from "./model";

const maxLibrarySize = 10000;

export class LibraryService {
    private apiClient: ApiClient;
    private randomChoice: RandomChoice;
    private albumCount: number;

    constructor(apiClient: ApiClient, randomChoice: RandomChoice) {
        this.apiClient = apiClient;
        this.randomChoice = randomChoice;
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
        const offset = this.randomChoice.randomInt(albumCount);
        const album = await this.apiClient.getAlbumByOffset(offset);

        return {
            name: album.name,
            id: album.id,
            cover: album.images[0].url,
            artists: this.formatArtists(album.artists),
        };
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
}