import {configure, shallow} from "enzyme";
import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import {MainPage} from "./MainPage";
import {instance, mock, when} from "ts-mockito";
import {LibraryService, LibraryStats} from "../spotify/LibraryService";
import {Spinner} from "../components/Spinner";

configure({adapter: new Adapter()});

describe("MainPage", () => {
    let libraryService: LibraryService;

    beforeEach(() => {
        libraryService = mock(LibraryService);
    });

    it("shows a spinner while requests are in progress", () => {
        when(libraryService.getUsername()).thenReturn(new Promise(() => null));
        when(libraryService.getStats()).thenReturn(new Promise(() => null));

        const wrapper = shallow(<MainPage libraryService={instance(libraryService)}/>);

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

        const wrapper = shallow(<MainPage libraryService={instance(libraryService)}/>);
        await getUsernamePromise;
        await getStatsPromise;

        expect(wrapper.find('.username').text()).toEqual("expected username");
        expect(wrapper.find('.track-count').text()).toEqual("2342");
        expect(wrapper.find('.album-count').text()).toEqual("5");
        expect(wrapper.find('.remaining-items').text()).toEqual("23");

        expect(wrapper.find(Spinner).exists()).toBeFalsy();
    });
});
