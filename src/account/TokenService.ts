import {callbackPath, clientId, redirectUri, scopes} from "../config/Config";
import {parse} from "query-string";
import {History} from "history";

const TOKEN_KEY = "token";

export class TokenService {
    private localStorage: Storage;
    private location: Location;
    private history: History;

    constructor(localStorage: Storage, location: Location, history: History) {
        this.localStorage = localStorage;
        this.location = location;
        this.history = history;
    }

    public isLoggedIn(): boolean {
        return this.localStorage.getItem(TOKEN_KEY) !== null;
    }

    public getToken(): string | null {
        return this.localStorage.getItem(TOKEN_KEY);
    }

    public isOauthCallback(): boolean {
        return this.location.pathname === callbackPath;
    }

    public handleOauthCallback(): void {
        const queryParameters = parse(this.location.hash);
        this.localStorage.setItem("token", queryParameters.access_token);
        this.history.push("/");
    }

    public redirectToLogin() {
        const spaceSeparatedScopes = scopes.join(" ");
        const authUri = "https://accounts.spotify.com/authorize" +
            `?client_id=${clientId}` +
            `&redirect_uri=${redirectUri}` +
            `&scope=${spaceSeparatedScopes}` +
            "&response_type=token";

        this.location.assign(authUri);
    }
}
