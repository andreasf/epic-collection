import {configure, mount} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {LocationDescriptor} from "history";
import * as React from "react";
import {MemoryRouter} from "react-router-dom";
import {LoginPage} from "../pages/LoginPage";
import {MainPage} from "../pages/MainPage";
import {Routes} from "./Routes";
import {TokenService} from "../account/TokenService";
import {instance, mock, verify, when} from "ts-mockito";

configure({adapter: new Adapter()});

describe("Routes", () => {
    let tokenService: TokenService;

    beforeEach(() => {
        tokenService = mock(TokenService);
        when(tokenService.isLoggedIn()).thenReturn(true);
    });

    const renderAt = (path: string) => {
        return mount((
            <MemoryRouter initialEntries={[path as LocationDescriptor]}>
                <Routes tokenService={instance(tokenService)}/>
            </MemoryRouter>
        ));
    };

    describe("Routing", () => {
        const routes = [
            {
                component: MainPage,
                path: "/",
            },
            {
                component: LoginPage,
                path: "/login",
            },
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
        describe("when no token is stored", () => {
            it("redirects to Spotify Accounts Service login", () => {
                when(tokenService.isLoggedIn()).thenReturn(false);

                renderAt("/");

                verify(tokenService.isLoggedIn()).once();
                verify(tokenService.redirectToLogin()).once();
            });
        });

        describe("when a token is stored", () => {
            it("does not redirect anywhere", () => {
                renderAt("/");

                verify(tokenService.isLoggedIn()).once();
                verify(tokenService.redirectToLogin()).never();
            });
        });

    });
});
