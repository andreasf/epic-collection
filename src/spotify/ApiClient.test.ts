import {InteractionObject, Pact} from "@pact-foundation/pact";
import * as path from "path";
import {meTracksPage1} from "./test_resources/me_tracks_response";
import {ApiClient} from "./ApiClient";
import {meResponse} from "./test_resources/me_response";
import {TokenService} from "../account/TokenService";
import {instance, mock, when} from "ts-mockito";

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

    beforeAll(() => provider.setup());

    beforeEach(async () => {
        tokenService = mock(TokenService);
        when(tokenService.getToken()).thenReturn("real-access-token");

        apiClient = new ApiClient(`http://localhost:${mockServerPort}`, window, instance(tokenService));

        await provider.removeInteractions();
    });

    describe("getTrackCount", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "foo",
                uponReceiving: "GET /v1/me/tracks (page 1)",
                withRequest: {
                    method: "GET",
                    path: "/v1/me/tracks",
                    query: "offset=0&limit=2",
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

            expect(count).toEqual(3);
        });
    });

    describe("getUsername", () => {
        beforeEach(async () => {
            const interaction: InteractionObject = {
                state: "foo",
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

            expect(username).toEqual("JM Wizzler");
        });
    });


    afterEach(() => provider.verify());

    afterAll(() => provider.finalize());
});

function preflightRequestFor(interaction: InteractionObject): InteractionObject {
    const headers = interaction.withRequest.headers;
    const allowedHeaders = headers ? Object.keys(headers).join(", ") : "*";

    return {
        state: interaction.state,
        uponReceiving: `OPTIONS ${interaction.withRequest.path}`,
        withRequest: {
            method: "OPTIONS",
            path: interaction.withRequest.path,
        },
        willRespondWith: {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": `${allowedHeaders}`,
            },
        }
    };
}
