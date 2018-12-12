import {InteractionObject, Pact} from "@pact-foundation/pact";
import * as path from "path";
import {meTracksPage1} from "./test_resources/me_tracks_response";
import {ApiClient} from "./ApiClient";
import {meResponse} from "./test_resources/me_response";
import {TokenService} from "../account/TokenService";
import {instance, mock, when} from "ts-mockito";
import {meAlbumsResponse} from "./test_resources/me_albums_response";
import {ErrorHandlingFetch} from "./ErrorHandlingFetch";
import {ApiAlbum} from "./model";
import Spy = jasmine.Spy;

const mockServerPort = 8123;

describe("ApiClient", () => {
    const provider = new Pact({
        consumer: "snoutify",
        cors: false,
        dir: path.resolve(process.cwd(), "pacts"),
        port: mockServerPort,
        provider: "spotify",
    });

    let apiClient: ApiClient;
    let tokenService: TokenService;
    let fetchSpy: Spy;

    beforeAll(() => provider.setup());

    beforeEach(async () => {
        tokenService = mock(TokenService);
        when(tokenService.getToken()).thenReturn("real-access-token");

        const errorHandlingFetch = new ErrorHandlingFetch(window, tokenService);
        fetchSpy = spyOn(errorHandlingFetch, "fetch").and.callThrough();

        apiClient = new ApiClient(
            `http://localhost:${mockServerPort}`,
            errorHandlingFetch,
            instance(tokenService));

        await provider.removeInteractions();
    });

    describe("getAlbumCount", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with 3 albums",
                uponReceiving: "GET /v1/me/albums (page 1)",
                withRequest: {
                    method: "GET",
                    path: "/v1/me/albums",
                    query: "offset=0&limit=1",
                    headers: {
                        Authorization: "Bearer real-access-token"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: meAlbumsResponse
                }
            };

            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("returns the number of albums", async () => {
            const count = await apiClient.getAlbumCount();

            expect(count).toEqual(3);
            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error retrieving album count");
        });
    });

    describe("getAlbumByOffset", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with 3 albums",
                uponReceiving: "GET /v1/me/albums (by offset)",
                withRequest: {
                    method: "GET",
                    path: "/v1/me/albums",
                    query: "offset=0&limit=1",
                    headers: {
                        Authorization: "Bearer real-access-token"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: meAlbumsResponse
                }
            };

            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("returns the album", async () => {
            const album = await apiClient.getAlbumByOffset(0);

            expect(album).toEqual({
                id: "album-1-id",
                name: "album-1-name",
                artists: [
                    {name: "artist-1"},
                    {name: "artist-2"},
                ],
                images: [
                    {width: 480, height: 480, url: "/images/album-1.png"}
                ],
                tracks: {
                    items: [
                        {id: "album-1-track-1"},
                        {id: "album-1-track-2"},
                        {id: "album-1-track-3"},
                    ],
                    total: 3
                }
            } as ApiAlbum);
            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error retrieving album");
        });
    });

    describe("getTrackCount", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with 5 tracks",
                uponReceiving: "GET /v1/me/tracks (page 1)",
                withRequest: {
                    method: "GET",
                    path: "/v1/me/tracks",
                    query: "offset=0&limit=1",
                    headers: {
                        Authorization: "Bearer real-access-token"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: meTracksPage1
                }
            };

            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("returns the number of tracks", async () => {
            const count = await apiClient.getTrackCount();

            expect(count).toEqual(5);
            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error retrieving track count");
        });
    });

    describe("getUsername", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with test user",
                uponReceiving: "GET /v1/me",
                withRequest: {
                    method: "GET",
                    path: "/v1/me",
                    headers: {
                        Authorization: "Bearer real-access-token"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: meResponse
                }
            };

            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("returns the username", async () => {
            const username = await apiClient.getUsername();

            expect(username).toEqual("Test User");
            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error retrieving username");
        });
    });

    describe("getUsername (error)", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "endpoints returning 500",
                uponReceiving: "GET /v1/me (error)",
                withRequest: {
                    method: "GET",
                    path: "/v1/me",
                    headers: {
                        Authorization: "Bearer real-access-token"
                    }
                },
                willRespondWith: {
                    status: 500,
                }
            };

            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("throws an error", async () => {
            try {
                await apiClient.getUsername();
                fail("should have thrown an error");
            } catch (e) {
                expect(e.message).toEqual("error retrieving username: 500 Internal Server Error");
            }
        });
    });


    afterEach(() => provider.verify());

    afterAll(() => provider.finalize());
});

function preflightRequestFor(interaction: InteractionObject): InteractionObject {
    const headers = interaction.withRequest.headers;
    const allowedHeaders = headers ? Object.keys(headers).join(", ").toLowerCase() : "*";

    return {
        state: interaction.state,
        uponReceiving: `OPTIONS ${interaction.withRequest.path}`,
        withRequest: {
            method: "OPTIONS",
            path: interaction.withRequest.path,
            headers: {
                "Origin": "http://localhost",
                "Access-Control-Request-Method": interaction.withRequest.method,
                "Access-Control-Request-Headers": `${allowedHeaders}`,
            }
        },
        willRespondWith: {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": 'http://localhost',
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": `${allowedHeaders}`,
            },
        }
    };
}
