import {InteractionObject, Pact} from "@pact-foundation/pact";
import * as path from "path";
import {meTracksPage1} from "./test_resources/me_tracks_response";
import {ApiClient} from "./ApiClient";

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

    beforeEach(() => {
        apiClient = new ApiClient(`http://localhost:${mockServerPort}`, window);
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
                        Authorization: "Bearer access-token"
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

            await provider.setup();
            await provider.addInteraction(preflightRequestFor(interaction));
            await provider.addInteraction(interaction);
        });

        it("returns the number of tracks", async () => {
            const count = await apiClient.getTrackCount();

            expect(count).toEqual(3);
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
