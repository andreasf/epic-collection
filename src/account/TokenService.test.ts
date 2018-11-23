import {TokenService} from "./TokenService";
import {anything, instance, mock, verify, when} from "ts-mockito";
import {clientId} from "../config/Config";
import {Action, History, LocationDescriptorObject, UnregisterCallback} from "history";
import {Location as RouterLocation} from "history";
import TransitionPromptHook = History.TransitionPromptHook;
import Href = History.Href;
import LocationListener = History.LocationListener;
import Path = History.Path;
import LocationState = History.LocationState;

describe("TokenService", () => {
    let tokenService: TokenService;
    let localStorage: Storage;
    let location: Location;
    let history: History;

    beforeEach(() => {
        history = mock(NiceHistory);
        localStorage = mock(Storage);
        location = mock(NiceLocation);
        tokenService = new TokenService(instance(localStorage), instance(location), instance(history));
    });

    describe("isLoggedIn", () => {
        it("returns false if no token is stored", () => {
            when(localStorage.getItem(anything())).thenReturn(null);

            expect(tokenService.isLoggedIn()).toBeFalsy();

            verify(localStorage.getItem("token")).once();
        });

        it("returns true if a token is stored", () => {
            when(localStorage.getItem(anything())).thenReturn("a token");

            expect(tokenService.isLoggedIn()).toBeTruthy();

            verify(localStorage.getItem("token")).once();
        });
    });

    describe("redirectToLogin", () => {
        it("redirects", () => {
            tokenService.redirectToLogin();

            const authUri = "https://accounts.spotify.com/authorize" +
                `?client_id=${clientId}` +
                "&redirect_uri=http://localhost:3000/oauth/callback" +
                "&scope=user-library-read" +
                "&response_type=token";

            verify(location.assign(authUri)).once();
        });
    });

    describe("isOauthCallback", () => {
        describe("when on '/oauth/callback", () => {
            it("returns true", () => {
                when(location.pathname).thenReturn("/oauth/callback");

                expect(tokenService.isOauthCallback()).toBeTruthy();

                verify(location.pathname).once();
            });
        });

        describe("when not on '/oauth/callback", () => {
            it("returns false", () => {
                when(location.pathname).thenReturn("/");

                expect(tokenService.isOauthCallback()).toBeFalsy();

                verify(location.pathname).once();
            });
        });
    });

    describe("handleOauthCallback", () => {
        it("stores the token in localStorage and changes to /", () => {
            when(location.hash).thenReturn("#access_token=token-value&token_type=Bearer&expires_in=3600&state=state");

            tokenService.handleOauthCallback();

            verify(localStorage.setItem("token", "token-value")).once();
            verify(history.push("/")).once();
        });
    });

    describe("getToken", () => {
        it("returns the token from LocalStorage", () => {
            when(localStorage.getItem(anything())).thenReturn("expected token");

            const actualToken = tokenService.getToken();

            expect(actualToken).toEqual("expected token");
        });
    });
});

// IDE-generated implementation of interface because Mockito complained
class NiceLocation implements Location {
    public hash: string;
    public host: string;
    public hostname: string;
    public href: string;
    public readonly origin: string;
    public pathname: string;
    public port: string;
    public protocol: string;
    public search: string;

    public assign(url: string): void {
        // empty
    }

    public reload(forcedReload?: boolean): void {
        // empty
    }

    public replace(url: string): void {
        // empty
    }

    public toString(): string {
        return "";
    }
}

class NiceHistory implements History {
    public action: Action;
    public length: number;
    public location: RouterLocation;

    public block(prompt?: boolean | string | TransitionPromptHook): UnregisterCallback {
        throw new Error("not implemented");
    }

    public createHref(location: LocationDescriptorObject): Href {
        throw new Error("not implemented");
    }

    public go(n: number): void {
        throw new Error("not implemented");
    }

    public goBack(): void {
        throw new Error("not implemented");
    }

    public goForward(): void {
        throw new Error("not implemented");
    }

    public listen(listener: LocationListener): UnregisterCallback {
        throw new Error("not implemented");
    }

    public push(path: Path, state?: LocationState): void;
    public push(location: LocationDescriptorObject): void;
    public push(path: Path | LocationDescriptorObject, state?: LocationState): void {
        // empty
    }

    public replace(path: Path, state?: LocationState): void;
    public replace(location: LocationDescriptorObject): void;
    public replace(path: Path | LocationDescriptorObject, state?: LocationState): void {
        // empty
    }

}
