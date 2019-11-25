import {config} from "../config/Config";
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
        return this.location.pathname === config.callbackPath;
    }

    public handleOauthCallback(): void {
        const queryParameters = parse(this.location.hash);
        this.localStorage.setItem("token", queryParameters.access_token);
        this.history.push("/home");
    }

    public redirectToLogin() {
        const spaceSeparatedScopes = config.scopes.join(" ");
        const redirectUri = this.location.origin + config.callbackPath;
        const authUri = config.authorizeUri +
            `?client_id=${config.clientId}` +
            `&redirect_uri=${redirectUri}` +
            `&scope=${spaceSeparatedScopes}` +
            "&response_type=token";

        this.location.assign(authUri);
    }

    public logout() {
        this.localStorage.clear();
        this.location.assign(config.logoutUri);
    }
}
