import {configure, mount} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {LocationDescriptor} from "history";
import * as React from "react";
import {MemoryRouter} from "react-router-dom";
import {MainPage} from "../pages/MainPage";
import {Routes} from "./Routes";
import {TokenService} from "../account/TokenService";
import {instance, mock, verify, when} from "ts-mockito";
import {LibraryService} from "../spotify/LibraryService";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import {AlbumPage} from "../pages/AlbumPage";
import {ConfirmationPage} from "../pages/ConfirmationPage";
import {LandingPage} from "../pages/LandingPage";

configure({adapter: new Adapter()});

describe("Routes", () => {
    let tokenService: TokenService;
    let libraryService: LibraryService;
    let errorMessageService: ErrorMessageService;

    beforeEach(() => {
        tokenService = mock(TokenService);
        libraryService = mock(LibraryService);
        errorMessageService = mock(ErrorMessageService);
        when(tokenService.isLoggedIn()).thenReturn(true);
        when(tokenService.isOauthCallback()).thenReturn(false);
        when(libraryService.getStats()).thenReturn(new Promise(() => null));
        when(libraryService.getRandomAlbum()).thenReturn(new Promise(() => null));
    });

    const renderAt = (path: string) => {
        return mount((
            <MemoryRouter initialEntries={[path as LocationDescriptor]}>
                <Routes errorMessageService={instance(errorMessageService)}
                        libraryService={instance(libraryService)}
                        tokenService={instance(tokenService)}/>
            </MemoryRouter>
        ));
    };

    describe("Routing", () => {
        const routes = [
            {
                component: LandingPage,
                path: "/",
            },
            {
                component: MainPage,
                path: "/home",
            },
            {
                component: AlbumPage,
                path: "/find-albums",
            },
            {
                component: ConfirmationPage,
                path: "/confirm-moving",
            }
        ];

        for (const currentRoute of routes) {
            it(`routes ${currentRoute.path} to ${currentRoute.component.name}`, () => {
                const wrapper = renderAt(currentRoute.path);

                for (const route of routes) {
                    if (route === currentRoute || route.component === currentRoute.component) {
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
    });
});
