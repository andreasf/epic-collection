import {ApiClient} from "./ApiClient";

const maxLibrarySize = 10000;

export class LibraryService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    public async getStats(): Promise<LibraryStats> {
        const [albums, tracks] = await Promise.all([
            this.apiClient.getAlbumCount(),
            this.apiClient.getTrackCount()
        ]);

        return {
            albums,
            tracks,
            remaining: maxLibrarySize - albums - tracks
        } as LibraryStats;
    }

    public getUsername(): Promise<string> {
        return this.apiClient.getUsername();
    }
}

export interface LibraryStats {
    albums: number;
    tracks: number;
    remaining: number;
}