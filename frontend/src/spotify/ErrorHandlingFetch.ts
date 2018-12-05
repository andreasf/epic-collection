export class ErrorHandlingFetch {
    private globalFetch: GlobalFetch;

    constructor(fetch: GlobalFetch) {
        this.globalFetch = fetch;
    }

    public async fetch(errorMessage: string,
          input?: Request | string,
          init?: RequestInit): Promise<Response> {

        const response = await this.globalFetch.fetch(input, init);

        if (!response.ok) {
            throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`.trim());
        }

        return response;
    }
}