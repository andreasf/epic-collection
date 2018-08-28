const TOKEN_KEY = "token";

export class TokenService {
    private localStorage: Storage;

    constructor(localStorage: Storage) {
        this.localStorage = localStorage;
    }

    public isLoggedIn(): boolean {
        return this.localStorage.getItem(TOKEN_KEY) !== null;
    }

    public redirectToLogin() {
        throw new Error("not implemented");
    }
}
