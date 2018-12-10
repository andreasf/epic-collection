import {ApiAlbum, PaginatedLibraryAlbums, PaginatedLibraryTracks, UserProfile} from "./model";
import {TokenService} from "../account/TokenService";
import {ErrorHandlingFetch} from "./ErrorHandlingFetch";

export class ApiClient {
    private apiPrefix: string;
    private errorHandlingFetch: ErrorHandlingFetch;
    private tokenService: TokenService;

    constructor(apiPrefix: string, fetch: ErrorHandlingFetch, tokenService: TokenService) {
        this.apiPrefix = apiPrefix;
        this.errorHandlingFetch = fetch;
        this.tokenService = tokenService;
    }

    public async getAlbumCount(): Promise<number> {
        const url = `${this.apiPrefix}/v1/me/albums?offset=0&limit=1`;
        const response = await this.errorHandlingFetch.fetch("error retrieving album count", url, {
            headers: {
                "Authorization": `Bearer ${this.tokenService.getToken()}`
            },
        });

        const paginatedLibraryTracks = await response.json() as PaginatedLibraryAlbums;
        return paginatedLibraryTracks.total;
    }

    public async getTrackCount(): Promise<number> {
        const url = `${this.apiPrefix}/v1/me/tracks?offset=0&limit=1`;
        const response = await this.errorHandlingFetch.fetch("error retrieving track count", url, {
            headers: {
                "Authorization": `Bearer ${this.tokenService.getToken()}`
            },
        });

        const paginatedLibraryTracks = await response.json() as PaginatedLibraryTracks;
        return paginatedLibraryTracks.total;
    }

    public async getUsername(): Promise<string> {
        const url = `${this.apiPrefix}/v1/me`;
        const response = await this.errorHandlingFetch.fetch("error retrieving username", url, {
            headers: {
                "Authorization": `Bearer ${this.tokenService.getToken()}`
            },
        });

        const userProfileReponse = await response.json() as UserProfile;
        return userProfileReponse.display_name;
    }

    public async getAlbumByOffset(offset: number): Promise<ApiAlbum> {
        const url = `${this.apiPrefix}/v1/me/albums?offset=${offset}&limit=1`;
        const response = await this.errorHandlingFetch.fetch("error retrieving album", url, {
            headers: {
                "Authorization": `Bearer ${this.tokenService.getToken()}`
            },
        });

        const paginatedLibraryTracks = await response.json() as PaginatedLibraryAlbums;
        return paginatedLibraryTracks.items[0].album;
    }
}
