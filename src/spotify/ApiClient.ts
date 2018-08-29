import {PaginatedLibraryTracks} from "./model";

export class ApiClient {
    private apiPrefix: string;
    private fetch: GlobalFetch;

    constructor(apiPrefix: string, fetch: GlobalFetch) {
        this.apiPrefix = apiPrefix;
        this.fetch = fetch;
    }

    public async getTrackCount(): Promise<number> {
        const url = `${this.apiPrefix}/v1/me/tracks&offset=0&limit=2`;
        const response = await this.fetch.fetch(url,{
            headers: {
                "Authorization": "Bearer access-token"
            },
            credentials: "include",
        });
        const paginatedLibraryTracks = await response.json() as PaginatedLibraryTracks;
        return paginatedLibraryTracks.total;
    }
}
