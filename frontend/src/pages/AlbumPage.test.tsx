import * as React from "react";
import {Album, LibraryService} from "../spotify/LibraryService";
import {instance, mock, verify, when} from "ts-mockito";
import {configure, shallow} from "enzyme";
import {AlbumPage} from "./AlbumPage";
import * as Adapter from "enzyme-adapter-react-16";
import {Spinner} from "../components/Spinner";

configure({adapter: new Adapter()});

const album = {
    name: "album-name",
    artists: "artists",
    cover: "cover.jpg",
    id: "album-id"
} as Album;

describe("AlbumPage", () => {
    let libraryService: LibraryService;

    beforeEach(() => {
        libraryService = mock(LibraryService);
    });

    const shallowRender = () =>
        shallow(<AlbumPage libraryService={instance(libraryService)}/>);

    it("retrieves a random album and shows the information", async () => {
        const albumPromise = Promise.resolve(album);
        when(libraryService.getRandomAlbum()).thenReturn(albumPromise);

        const wrapper = shallowRender();
        await albumPromise;

        verify(libraryService.getRandomAlbum()).once();

        expect(wrapper.find(".album-name").text()).toEqual("album-name");
        expect(wrapper.find(".album-artists").text()).toEqual("artists");
        expect(wrapper.find(".album-cover img").get(0).props)
            .toHaveProperty("src", "cover.jpg");
        expect(wrapper.find(Spinner).exists()).toBeFalsy();
    });

    it("shows a spinner while the album is loading", () => {
        when(libraryService.getRandomAlbum()).thenReturn(new Promise((() => null)));

        const wrapper = shallowRender();

        verify(libraryService.getRandomAlbum()).once();

        expect(wrapper.find(Spinner).exists()).toBeTruthy();
    });
});