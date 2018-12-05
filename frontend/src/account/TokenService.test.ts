import {TokenService} from "./TokenService";
import {anything, instance, mock, verify, when} from "ts-mockito";
import {config} from "../config/Config";
import {History} from "history";
import {NiceHistory, NiceLocation} from "../test_doubles/test_doubles";

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
            when(location.origin).thenReturn("https://where-this-is-deployed:1234");

            tokenService.redirectToLogin();

            const authUri = "https://accounts.spotify.com/authorize" +
                `?client_id=${config.clientId}` +
                "&redirect_uri=https://where-this-is-deployed:1234/oauth/callback" +
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
