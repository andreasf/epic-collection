import {PaginatedLibraryAlbums, PaginatedLibraryTracks, UserProfile} from "./model";
import {TokenService} from "../account/TokenService";

export class ApiClient {
    private apiPrefix: string;
    private fetch: GlobalFetch;
    private tokenService: TokenService;

    constructor(apiPrefix: string, fetch: GlobalFetch, tokenService: TokenService) {
        this.apiPrefix = apiPrefix;
        this.fetch = fetch;
        this.tokenService = tokenService;
    }

    public async getAlbumCount(): Promise<number> {
        const url = `${this.apiPrefix}/v1/me/albums?offset=0&limit=1`;
        const response = await this.fetch.fetch(url, {
            headers: {
                "Authorization": `Bearer ${this.tokenService.getToken()}`
            },
            credentials: "include",
        });

        const paginatedLibraryTracks = await response.json() as PaginatedLibraryAlbums;
        return paginatedLibraryTracks.total;
    }

    public async getTrackCount(): Promise<number> {
        const url = `${this.apiPrefix}/v1/me/tracks?offset=0&limit=1`;
        const response = await this.fetch.fetch(url, {
            headers: {
                "Authorization": `Bearer ${this.tokenService.getToken()}`
            },
            credentials: "include",
        });

        const paginatedLibraryTracks = await response.json() as PaginatedLibraryTracks;
        return paginatedLibraryTracks.total;
    }

    public async getUsername(): Promise<string> {
        const url = `${this.apiPrefix}/v1/me`;
        const response = await this.fetch.fetch(url, {
            headers: {
                "Authorization": `Bearer ${this.tokenService.getToken()}`
            },
            credentials: "same-origin",
        });
        const userProfileReponse = await response.json() as UserProfile;
        return userProfileReponse.display_name;
    }
}
