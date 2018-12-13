import * as React from "react";
import {Album, LibraryService} from "../spotify/LibraryService";
import {anyString, anything, instance, mock, verify, when} from "ts-mockito";
import {configure, shallow, ShallowWrapper} from "enzyme";
import {AlbumPage} from "./AlbumPage";
import * as Adapter from "enzyme-adapter-react-16";
import {Spinner} from "../components/Spinner";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import {History} from "history";
import {NiceHistory} from "../test_doubles/test_doubles";

configure({adapter: new Adapter()});

const album1 = {
    name: "album-1-name",
    artists: "artists",
    cover: "cover.jpg",
    id: "album-1-id",
    tracks: ["track-1", "track-2"]
} as Album;

const album2 = {
    name: "second-album-name",
    artists: "other-artists",
    cover: "cover-2.jpg",
    id: "album-2-id",
    tracks: ["track-1", "track-2", "track-3"]
} as Album;

describe("AlbumPage", () => {
    let errorMessageService: ErrorMessageService;
    let history: History;
    let libraryService: LibraryService;

    beforeEach(() => {
        errorMessageService = mock(ErrorMessageService);
        history = mock(NiceHistory);
        libraryService = mock(LibraryService);
    });

    const shallowRender = () =>
        shallow(<AlbumPage errorMessageService={instance(errorMessageService)}
                           history={instance(history)}
                           libraryService={instance(libraryService)}/>);

    it("retrieves a random album and shows the information", async () => {
        const albumPromise = Promise.resolve(album1);
        when(libraryService.getRandomAlbum()).thenReturn(albumPromise);

        const wrapper = shallowRender();
        await albumPromise;
        wrapper.find(".album-cover img").simulate("load");

        verify(libraryService.getRandomAlbum()).once();

        expect(wrapper.find(".album-name").text()).toEqual("album-1-name");
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
        const albumPromise = Promise.resolve(album1);
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

    describe("when clicking 'select'", () => {
        let wrapper: ShallowWrapper;

        beforeEach(async () => {
            // first album
            const album1Promise = Promise.resolve(album1);
            when(libraryService.getRandomAlbum()).thenReturn(album1Promise);

            wrapper = shallowRender();

            await album1Promise;
            wrapper.find(".album-cover img").simulate("load");
            expect(wrapper.find(".album-name").text()).toEqual("album-1-name");

            // second album
            const album2Promise = Promise.resolve(album2);
            when(libraryService.getRandomAlbum()).thenReturn(album2Promise);
            when(libraryService.getSelectedCount()).thenReturn(42);

            wrapper.find("button.select").simulate("click");

            verify(libraryService.getRandomAlbum()).twice();
            await album2Promise;
        });

        it("selects the album for moving and loads another album", () => {
            verify(libraryService.selectForMoving(album1)).called();

            expect(wrapper.find(".album-name").text()).toEqual("second-album-name");
            expect(wrapper.find(".album-artists").text()).toEqual("other-artists");
            expect(wrapper.find(".album-cover img").get(0).props)
                .toHaveProperty("src", "cover-2.jpg");
        });

        it("shows a spinner while cover and data are still loading", () => {
            expect(wrapper.find(Spinner).exists()).toBeTruthy();
        });

        it("hides the spinner once data and image are loaded", () => {
            wrapper.find(".album-cover img").simulate("load");
            expect(wrapper.find(Spinner).exists()).toBeFalsy();
        });

        it("shows the '# tracks selected' counter", () => {
            // number of tracks + number of albums
            expect(wrapper.find(".selected-count").text()).toEqual("42 selected");
        });
    });

    describe("when clicking 'keep'", () => {
        let wrapper: ShallowWrapper;

        beforeEach(async () => {
            // first album
            const album1Promise = Promise.resolve(album1);
            when(libraryService.getRandomAlbum()).thenReturn(album1Promise);

            wrapper = shallowRender();

            await album1Promise;
            wrapper.find(".album-cover img").simulate("load");
            expect(wrapper.find(".album-name").text()).toEqual("album-1-name");

            // second album
            const album2Promise = Promise.resolve(album2);
            when(libraryService.getRandomAlbum()).thenReturn(album2Promise);
            when(libraryService.getSelectedCount()).thenReturn(42);

            wrapper.find("button.keep").simulate("click");

            verify(libraryService.getRandomAlbum()).twice();
            await album2Promise;
        });

        it("tells LibraryService to keep the album and loads another one", () => {
            verify(libraryService.selectForMoving(anything())).never();
            verify(libraryService.keepAlbum(album1)).called();

            expect(wrapper.find(".album-name").text()).toEqual("second-album-name");
            expect(wrapper.find(".album-artists").text()).toEqual("other-artists");
            expect(wrapper.find(".album-cover img").get(0).props)
                .toHaveProperty("src", "cover-2.jpg");
        });

        it("shows a spinner while cover and data are still loading", () => {
            expect(wrapper.find(Spinner).exists()).toBeTruthy();
        });

        it("hides the spinner once data and image are loaded", () => {
            wrapper.find(".album-cover img").simulate("load");
            expect(wrapper.find(Spinner).exists()).toBeFalsy();
        });

        it("shows the '# tracks selected' counter", () => {
            // number of tracks + number of albums
            expect(wrapper.find(".selected-count").text()).toEqual("42 selected");
        });
    });

    describe("when clicking 'back'", () => {
        it("clears the selection and navigates to the main page", () => {
            const albumPromise = Promise.resolve(album1);
            when(libraryService.getRandomAlbum()).thenReturn(albumPromise);

            const wrapper = shallowRender();

            wrapper.find(".back-button").simulate("click");

            verify(history.push("/")).called();
            verify(libraryService.clearSelection()).called();
        });
    });

    describe("when clicking 'move'", () => {
        it("navigates to the confirmation page", () => {
            const albumPromise = Promise.resolve(album1);
            when(libraryService.getRandomAlbum()).thenReturn(albumPromise);

            const wrapper = shallowRender();

            wrapper.find(".move-button").simulate("click");

            verify(history.push("/confirm-moving")).called();
        });
    });
});