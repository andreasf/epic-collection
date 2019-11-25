import {BadMath} from "../test_doubles/test_doubles";

interface Config {
    clientId: string;
    apiPrefix: string;
    authorizeUri: string;
    logoutUri: string;
    callbackPath: string;
    scopes: string[];
}

const realConfig: Config = {
    clientId: process.env.REACT_APP_CLIENT_ID || "client-id env missing",
    apiPrefix: "https://api.spotify.com",
    authorizeUri: "https://accounts.spotify.com/authorize",
    logoutUri: "https://accounts.spotify.com/logout",
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
    logoutUri: "http://localhost:3000/fake/logout",
    callbackPath: "/oauth/callback",
    scopes: [
        "user-library-read",
        "user-library-modify",
        "playlist-modify-private",
    ]
};

export const config = process.env.REACT_APP_FAKE_API ? fakeConfig : realConfig;

export const math = process.env.REACT_APP_FAKE_API ? new BadMath() : Math;
