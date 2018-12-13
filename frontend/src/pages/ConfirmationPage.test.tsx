import {History} from "history";
import {LibraryService} from "../spotify/LibraryService";
import {NiceHistory} from "../test_doubles/test_doubles";
import {instance, mock, verify, when} from "ts-mockito";
import {configure, shallow, ShallowWrapper} from "enzyme";
import {ConfirmationPage} from "./ConfirmationPage";
import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import {Spinner} from "../components/Spinner";
import {ErrorMessageService} from "../errors/ErrorMessageService";

configure({adapter: new Adapter()});

describe("ConfirmationPage", () => {
    let errorMessageService: ErrorMessageService;
    let history: History;
    let libraryService: LibraryService;
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        errorMessageService = mock(ErrorMessageService);
        history = mock(NiceHistory);
        libraryService = mock(LibraryService);

        when(libraryService.getSelectedCount()).thenReturn(42);
        wrapper = shallowRender();
    });

    const shallowRender = () =>
        shallow(<ConfirmationPage errorMessageService={instance(errorMessageService)}
                                  history={instance(history)}
                                  libraryService={instance(libraryService)}/>);

    it("shows the number of selected albums/tracks", () => {
        expect(wrapper.find(".selected-count").text()).toEqual("42");
    });

    describe("when clicking 'move'", () => {
        it("moves tracks and shows a spinner", () => {
            const promise = Promise.resolve();
            when(libraryService.commit()).thenReturn(promise);

            wrapper.find(".move-button").simulate("click");

            expect(wrapper.find(Spinner).exists()).toBeTruthy();
            verify(libraryService.commit()).once();
        });

        it("finally navigates to the main page", async () => {
            const promise = Promise.resolve();
            when(libraryService.commit()).thenReturn(promise);

            wrapper.find(".move-button").simulate("click");
            await promise;

            verify(history.push("/")).called();
        });

        it("shows an error message and hides the spinner if something goes wrong", async () => {
            const promise = Promise.reject(new Error("error-message"));
            when(libraryService.commit()).thenReturn(promise);

            wrapper.find(".move-button").simulate("click");

            try {
                await promise;
                fail("promise should have been rejected");
            } catch (e) {
                verify(errorMessageService.show("error moving albums: error-message")).once();
                expect(wrapper.find(Spinner).exists()).toBeFalsy();
            }
        });
    });

    describe("when clicking 'cancel'", () => {
        it("returns to the album page", () => {
            wrapper.find(".cancel-button").simulate("click");

            verify(history.push("/find-albums")).called();
        });

        it("does not move any tracks", () => {
            wrapper.find(".cancel-button").simulate("click");

            verify(libraryService.clearSelection()).never();
            verify(libraryService.commit()).never();
        });
    });
});