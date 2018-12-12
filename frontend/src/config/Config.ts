import {BadMath} from "../test_doubles/test_doubles";

interface Config {
    clientId: string;
    apiPrefix: string;
    authorizeUri: string;
    callbackPath: string;
    scopes: string[];
}

const realConfig: Config = {
    clientId: "7994d45282104ed888a4de0fa8546fc5",
    apiPrefix: "https://api.spotify.com",
    authorizeUri: "https://accounts.spotify.com/authorize",
    callbackPath: "/oauth/callback",
    scopes: [
        "user-library-read",
        "user-library-modify",
        "playlist-modify-private",
    ]
};

const fakeConfig: Config = {
    clientId: "client-id",
    apiPrefix: "http://localhost:3000/fake",
    authorizeUri: "http://localhost:3000/fake/authorize",
    callbackPath: "/oauth/callback",
    scopes: [
        "user-library-read",
        "user-library-modify",
        "playlist-modify-private",
    ]
};

export const config = process.env.REACT_APP_FAKE_API ? fakeConfig : realConfig;

export const math = process.env.REACT_APP_FAKE_API ? new BadMath() : Math;