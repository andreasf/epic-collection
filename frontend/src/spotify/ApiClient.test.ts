import {InteractionObject, Pact} from "@pact-foundation/pact";
import * as path from "path";
import {meTracksResponse} from "./test_resources/me_tracks_response";
import {ApiClient, DepaginatedAlbum} from "./ApiClient";
import {meResponse} from "./test_resources/me_response";
import {TokenService} from "../account/TokenService";
import {instance, mock, when} from "ts-mockito";
import {meAlbumsResponse} from "./test_resources/me_albums_response";
import {ErrorHandlingFetch} from "./ErrorHandlingFetch";
import {MatcherResult} from "@pact-foundation/pact/dsl/matchers";
import {
    albumTracksPage2Response,
    albumTracksPage3Response,
    depaginatedAlbum,
    paginatedMeAlbumsResponse
} from "./test_resources/paginated_album_response";
import Spy = jasmine.Spy;

const mockServerPort = 8123;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

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

    describe("addToPlaylist", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with 3 albums",
                uponReceiving: "POST /v1/playlists/:id/tracks",
                withRequest: {
                    method: "POST",
                    path: "/v1/playlists/playlist-id/tracks",
                    headers: {
                        Authorization: "Bearer real-access-token",
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: {
                        uris: [
                            "spotify:track:track-id-1",
                            "spotify:track:track-id-2",
                        ]
                    }
                },
                willRespondWith: {
                    status: 201,
                }
            };

            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("adds tracks to the playlist", async () => {
            await apiClient.addToPlaylist("playlist-id", [
                "spotify:track:track-id-1",
                "spotify:track:track-id-2"
            ]);

            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error adding tracks to playlist");
        });
    });

    describe("createPlaylist", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with 3 albums",
                uponReceiving: "POST /v1/me/playlists",
                withRequest: {
                    method: "POST",
                    path: "/v1/me/playlists",
                    headers: {
                        Authorization: "Bearer real-access-token",
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: {
                        name: "playlist-name",
                        description: "playlist-description",
                        public: false,
                    }
                },
                willRespondWith: {
                    status: 201,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        id: "new-playlist-id"
                    }
                }
            };

            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("returns the playlist id", async () => {
            const id = await apiClient.createPlaylist("playlist-name", "playlist-description");

            expect(id).toEqual("new-playlist-id");
            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error creating playlist");
        });
    });

    describe("deleteAlbums", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with 3 albums",
                uponReceiving: "DELETE /v1/me/albums",
                withRequest: {
                    method: "DELETE",
                    path: "/v1/me/albums",
                    query: "ids=album-1-id,album-2-id",
                    headers: {
                        Authorization: "Bearer real-access-token",
                    },
                },
                willRespondWith: {
                    status: 200,
                }
            };

            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("deletes the albums", async () => {
            await apiClient.deleteAlbums(["album-1-id", "album-2-id"]);

            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error deleting albums");
        });
    });

    describe("getAlbumCount", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with 3 albums",
                uponReceiving: "GET /v1/me/albums (count)",
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
                    total: 3,
                    next: null,
                }
            } as DepaginatedAlbum);
            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error retrieving album");
        });
    });

    describe("getAlbumByOffset (with pagination)", () => {
        beforeEach(async () => {
            const paginatedMeAlbums: InteractionObject = {
                state: "with paginated album",
                uponReceiving: "GET /v1/me/albums (paginated)",
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
                    body: paginatedMeAlbumsResponse
                }
            };

            const albumTracksPage2: InteractionObject = {
                state: "with paginated album",
                uponReceiving: "GET /v1/albums/album-4-id/tracks (page 2)",
                withRequest: {
                    method: "GET",
                    path: "/v1/albums/album-4-id/tracks",
                    query: "offset=50&limit=50",
                    headers: {
                        Authorization: "Bearer real-access-token"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: albumTracksPage2Response
                }
            };

            const albumTracksPage3: InteractionObject = {
                state: "with paginated album",
                uponReceiving: "GET /v1/albums/album-4-id/tracks (page 3)",
                withRequest: {
                    method: "GET",
                    path: "/v1/albums/album-4-id/tracks",
                    query: "offset=100&limit=50",
                    headers: {
                        Authorization: "Bearer real-access-token"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: albumTracksPage3Response
                }
            };

            await provider.addInteraction(preflightRequestFor(paginatedMeAlbums));
            await provider.addInteraction(paginatedMeAlbums);
            await provider.addInteraction(preflightRequestFor(albumTracksPage2));
            await provider.addInteraction(albumTracksPage2);
            await provider.addInteraction(preflightRequestFor(albumTracksPage3));
            await provider.addInteraction(albumTracksPage3);
        });

        it("returns the album", async () => {
            const album = await apiClient.getAlbumByOffset(0);

            expect(album).toEqual(depaginatedAlbum);

            expect(fetchSpy.calls.argsFor(0)[0]).toEqual("error retrieving album");
            expect(fetchSpy.calls.argsFor(1)[0]).toEqual("error retrieving album tracks");
            expect(fetchSpy.calls.argsFor(2)[0]).toEqual("error retrieving album tracks");
        });
    });

    describe("getTrackCount", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "with 5 tracks",
                uponReceiving: "GET /v1/me/tracks",
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
                    body: meTracksResponse
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
    const allowedHeaders = headers ? filterHeaders(headers).join(", ").toLowerCase() : "*";
    const maybeQuery = interaction.withRequest.query ? `?${interaction.withRequest.query}` : "";

    return {
        state: interaction.state,
        uponReceiving: `OPTIONS ${interaction.withRequest.path}${maybeQuery} (${interaction.withRequest.method})`,
        withRequest: {
            method: "OPTIONS",
            path: interaction.withRequest.path,
            query: interaction.withRequest.query,
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

// not what the spec says, but what JSDOM does...
function filterHeaders(headers: { [name: string]: string | MatcherResult }) {
    const nope = ["content-type"];
    return Object.keys(headers)
        .filter(header => nope.indexOf(header.toLowerCase()) === -1);
}