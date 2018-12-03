import {configure, mount} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {LocationDescriptor} from "history";
import * as React from "react";
import {MemoryRouter} from "react-router-dom";
import {MainPage} from "../pages/MainPage";
import {Routes} from "./Routes";
import {TokenService} from "../account/TokenService";
import {instance, mock, verify, when} from "ts-mockito";
import {ApiClient} from "../spotify/ApiClient";

configure({adapter: new Adapter()});

describe("Routes", () => {
    let tokenService: TokenService;
    let apiClient: ApiClient;

    beforeEach(() => {
        tokenService = mock(TokenService);
        apiClient = mock(ApiClient);
        when(tokenService.isLoggedIn()).thenReturn(true);
        when(tokenService.isOauthCallback()).thenReturn(false);
    });

    const renderAt = (path: string) => {
        return mount((
            <MemoryRouter initialEntries={[path as LocationDescriptor]}>
                <Routes tokenService={instance(tokenService)} apiClient={instance(apiClient)}/>
            </MemoryRouter>
        ));
    };

    describe("Routing", () => {
        const routes = [
            {
                component: MainPage,
                path: "/",
            }
        ];

        for (const currentRoute of routes) {
            it(`routes ${currentRoute.path} to ${currentRoute.component.name}`, () => {
                const wrapper = renderAt(currentRoute.path);

                for (const route of routes) {
                    if (route === currentRoute) {
                        expect(wrapper.find(route.component).exists()).toBeTruthy();
                    } else {
                        expect(wrapper.find(route.component).exists()).toBeFalsy();
                    }
                }
            });
        }
    });

    describe("Login", () => {
        describe("when receiving an oauth callback", () => {
            it("stores the token", () => {
                when(tokenService.isOauthCallback()).thenReturn(true);

                renderAt("/oauth/callback");

                verify(tokenService.isOauthCallback()).once();
                verify(tokenService.handleOauthCallback()).once();
            });
        });

        describe("when no token is stored", () => {
            it("redirects to Spotify Accounts Service login", () => {
                when(tokenService.isLoggedIn()).thenReturn(false);

                renderAt("/");

                verify(tokenService.isLoggedIn()).once();
                verify(tokenService.redirectToLogin()).once();
                verify(tokenService.handleOauthCallback()).never();
            });
        });

        describe("when a token is stored", () => {
            it("does not redirect anywhere", () => {
                renderAt("/");

                verify(tokenService.isLoggedIn()).once();
                verify(tokenService.redirectToLogin()).never();
                verify(tokenService.handleOauthCallback()).never();
            });
        });
    });
});