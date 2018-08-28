import {TokenService} from "./TokenService";
import {anything, instance, mock, verify, when} from "ts-mockito";

describe("TokenService", () => {
    let tokenService: TokenService;
    let localStorage: Storage;

    beforeEach(() => {
        localStorage = mock(Storage);
        tokenService = new TokenService(instance(localStorage));
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
});
