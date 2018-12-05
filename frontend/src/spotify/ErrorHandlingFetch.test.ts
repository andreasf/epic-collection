import {ErrorHandlingFetch} from "./ErrorHandlingFetch";
import {anything, instance, mock, verify, when} from "ts-mockito";
import {TokenService} from "../account/TokenService";

describe("ErrorHandlingFetch", () => {
    let globalFetch: GlobalFetch;
    let errorHandlingFetch: ErrorHandlingFetch;
    let tokenService: TokenService;

    beforeEach(() => {
        globalFetch = mock(MockFetch);
        tokenService = mock(TokenService);
        errorHandlingFetch = new ErrorHandlingFetch(instance(globalFetch), instance(tokenService));
    });

    it("resolves when the response is ok", async () => {
        const expectedResponse = new Response("response body");
        when(globalFetch.fetch(anything(), anything())).thenResolve(expectedResponse);

        const requestOptions = {
            credentials: "include"
        } as RequestInit;

        const response = await errorHandlingFetch.fetch("error message", "url", requestOptions);

        verify(globalFetch.fetch("url", requestOptions)).called();
        expect(response).toEqual(expectedResponse);
    });

    it("rejects when the response is not ok", async () => {
        const expectedResponse = new Response("bad response", {
            status: 500,
            statusText: "status text"
        });
        when(globalFetch.fetch(anything(), anything())).thenResolve(expectedResponse);

        const requestOptions = {
            credentials: "include"
        } as RequestInit;

        try {
            await errorHandlingFetch.fetch("requested error message", "url", requestOptions);
            fail("should have rejected the promise");
        } catch (e) {
            expect(e.message).toEqual("requested error message: 500 status text");
        }
    });

    it("rejects with an error and asks to refresh the token when receiving 401", async () => {
        const expectedResponse = new Response("bad response", {
            status: 401
        });
        when(globalFetch.fetch(anything(), anything())).thenResolve(expectedResponse);

        try {
            await errorHandlingFetch.fetch("requested error message", "url");
            fail("should have rejected the promise");
        } catch (e) {
            expect(e.message).toEqual("invalid or expired access token");
            verify(tokenService.redirectToLogin()).called();
        }
    });
});

class MockFetch implements GlobalFetch {
    public fetch(input?: Request | string, init?: RequestInit): Promise<Response> {
        throw new Error("not implemented");
    }
}