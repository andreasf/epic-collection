import {configure, shallow} from "enzyme";
import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import {MainPage} from "./MainPage";
import {anyString, instance, mock, verify, when} from "ts-mockito";
import {LibraryService, LibraryStats} from "../spotify/LibraryService";
import {Spinner} from "../components/Spinner";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import {History} from "history";
import {NiceHistory} from "../test_doubles/test_doubles";
import {TokenService} from "../account/TokenService";

configure({adapter: new Adapter()});

describe("MainPage", () => {
    let libraryService: LibraryService;
    let errorMessageService: ErrorMessageService;
    let tokenService: TokenService;
    let history: History;

    beforeEach(() => {
        libraryService = mock(LibraryService);
        errorMessageService = mock(ErrorMessageService);
        tokenService = mock(TokenService);
        history = mock(NiceHistory);
    });

    const shallowRender = () => {
        return shallow(<MainPage errorMessageService={instance(errorMessageService)}
                                 history={instance(history)}
                                 libraryService={instance(libraryService)}
                                 tokenService={instance(tokenService)}/>);
    };

    it("shows a spinner while requests are in progress", () => {
        when(libraryService.getUsername()).thenReturn(new Promise(() => null));
        when(libraryService.getStats()).thenReturn(new Promise(() => null));

        const wrapper = shallowRender();

        expect(wrapper.find(Spinner).exists()).toBeTruthy();
    });

    it("shows the current username and library stats", async () => {
        const getUsernamePromise = Promise.resolve("expected username");
        const getStatsPromise = Promise.resolve({
            albums: 5,
            tracks: 2342,
            remaining: 23
        } as LibraryStats);
        when(libraryService.getUsername()).thenReturn(getUsernamePromise);
        when(libraryService.getStats()).thenReturn(getStatsPromise);

        const wrapper = shallowRender();
        await getUsernamePromise;
        await getStatsPromise;

        expect(wrapper.find('.username').text()).toEqual("expected username");
        expect(wrapper.find('.track-count').text()).toEqual("2342");
        expect(wrapper.find('.album-count').text()).toEqual("5");
        expect(wrapper.find('.remaining-items').text()).toEqual("23");

        expect(wrapper.find(Spinner).exists()).toBeFalsy();
    });

    it("shows an error message if retrieving stats fails", async () => {
        const statsPromise = Promise.reject(new Error("boo"));
        when(libraryService.getUsername()).thenReturn(new Promise(() => null));
        when(libraryService.getStats()).thenReturn(statsPromise);

        shallowRender();
        try {
            await statsPromise;
        } catch (e) {
            // promise always rejects
        }

        verify(errorMessageService.show(anyString())).once();
    });

    it("redirects to the albums page when clicking 'find albums'", async () => {
        const getUsernamePromise = Promise.resolve("expected username");
        const getStatsPromise = Promise.resolve({
            albums: 5,
            tracks: 2342,
            remaining: 23
        } as LibraryStats);
        when(libraryService.getUsername()).thenReturn(getUsernamePromise);
        when(libraryService.getStats()).thenReturn(getStatsPromise);

        const wrapper = shallowRender();
        await getUsernamePromise;
        await getStatsPromise;

        wrapper.find(".find-albums").simulate("click");
        verify(history.push("/find-albums")).called();
    });

    it("logs the user out when clicking logout", async () => {
        const getUsernamePromise = Promise.resolve("expected username");
        const getStatsPromise = Promise.resolve({
            albums: 5,
            tracks: 2342,
            remaining: 23
        } as LibraryStats);
        when(libraryService.getUsername()).thenReturn(getUsernamePromise);
        when(libraryService.getStats()).thenReturn(getStatsPromise);

        const wrapper = shallowRender();
        await getUsernamePromise;
        await getStatsPromise;

        wrapper.find(".logout-button").simulate("click");
        verify(tokenService.logout()).called()
    })
});
