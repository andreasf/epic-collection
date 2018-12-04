interface Config {
    clientId: string;
    apiPrefix: string;
    authorizeUri: string;
    callbackPath: string;
    redirectUri: string;
    scopes: string[];
}

const realConfig: Config = {
    clientId: "7994d45282104ed888a4de0fa8546fc5",
    apiPrefix: "https://api.spotify.com",
    authorizeUri: "https://accounts.spotify.com/authorize",
    callbackPath: "/oauth/callback",
    redirectUri: `http://localhost:3000/oauth/callback`,
    scopes: [
        "user-library-read",
    ]
};

const fakeConfig: Config = {
    clientId: "client-id",
    apiPrefix: "http://localhost:3000/fake",
    authorizeUri: "http://localhost:3000/fake/authorize",
    callbackPath: "/oauth/callback",
    redirectUri: "http://localhost:3000/oauth/callback",
    scopes: [
        "user-library-read",
    ]
};

export const config = process.env.REACT_APP_FAKE_API ? fakeConfig : realConfig;