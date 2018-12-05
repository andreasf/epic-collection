import {TokenService} from "../account/TokenService";

export class ErrorHandlingFetch {
    private globalFetch: GlobalFetch;
    private tokenService: TokenService;

    constructor(fetch: GlobalFetch, tokenService: TokenService) {
        this.globalFetch = fetch;
        this.tokenService = tokenService;
    }

    public async fetch(errorMessage: string,
          input?: Request | string,
          init?: RequestInit): Promise<Response> {

        const response = await this.globalFetch.fetch(input, init);

        if (response.status === 401) {
            this.tokenService.redirectToLogin();
            throw new Error("invalid or expired access token");
        }

        if (!response.ok) {
            throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`.trim());
        }

        return response;
    }
}