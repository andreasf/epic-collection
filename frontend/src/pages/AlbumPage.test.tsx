import * as React from "react";
import {Album, LibraryService} from "../spotify/LibraryService";
import {anyString, instance, mock, verify, when} from "ts-mockito";
import {configure, shallow} from "enzyme";
import {AlbumPage} from "./AlbumPage";
import * as Adapter from "enzyme-adapter-react-16";
import {Spinner} from "../components/Spinner";
import {ErrorMessageService} from "../errors/ErrorMessageService";

configure({adapter: new Adapter()});

const album = {
    name: "album-name",
    artists: "artists",
    cover: "cover.jpg",
    id: "album-id"
} as Album;

describe("AlbumPage", () => {
    let errorMessageService: ErrorMessageService;
    let libraryService: LibraryService;

    beforeEach(() => {
        errorMessageService = mock(ErrorMessageService);
        libraryService = mock(LibraryService);
    });

    const shallowRender = () =>
        shallow(<AlbumPage errorMessageService={instance(errorMessageService)}
                           libraryService={instance(libraryService)}/>);

    it("retrieves a random album and shows the information", async () => {
        const albumPromise = Promise.resolve(album);
        when(libraryService.getRandomAlbum()).thenReturn(albumPromise);

        const wrapper = shallowRender();
        await albumPromise;
        wrapper.find(".album-cover img").simulate("load");

        verify(libraryService.getRandomAlbum()).once();

        expect(wrapper.find(".album-name").text()).toEqual("album-name");
        expect(wrapper.find(".album-artists").text()).toEqual("artists");
        expect(wrapper.find(".album-cover img").get(0).props)
            .toHaveProperty("src", "cover.jpg");
        expect(wrapper.find(Spinner).exists()).toBeFalsy();
    });

    it("shows a spinner while the data is loading", () => {
        when(libraryService.getRandomAlbum()).thenReturn(new Promise((() => null)));

        const wrapper = shallowRender();

        verify(libraryService.getRandomAlbum()).once();

        expect(wrapper.find(Spinner).exists()).toBeTruthy();
    });

    it("shows a spinner while the cover image is loading", async () => {
        const albumPromise = Promise.resolve(album);
        when(libraryService.getRandomAlbum()).thenReturn(albumPromise);

        const wrapper = shallowRender();
        await albumPromise;

        verify(libraryService.getRandomAlbum()).once();

        expect(wrapper.find(Spinner).exists()).toBeTruthy();
        expect(wrapper.find(".album-cover img").get(0).props)
            .toHaveProperty("src", "cover.jpg");

        wrapper.find(".album-cover img").simulate("load");
        expect(wrapper.find(Spinner).exists()).toBeFalsy();
    });

    it("shows an error message if retrieving album data fails", async () => {
        const albumPromise = Promise.reject(new Error("boo"));
        when(libraryService.getRandomAlbum()).thenReturn(albumPromise);

        shallowRender();
        try {
            await albumPromise;
            fail("promise should have been rejected");
        } catch (e) {
            // promise always rejects
        }

        verify(errorMessageService.show(anyString())).once();
        verify(errorMessageService.show("error retrieving album: boo")).once();
    });
});