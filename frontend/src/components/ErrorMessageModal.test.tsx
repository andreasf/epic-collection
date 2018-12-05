import {configure, shallow} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {ErrorMessageModal} from "./ErrorMessageModal";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import {anything, capture, instance, mock, verify, when} from "ts-mockito";
import * as React from "react";

configure({adapter: new Adapter()});

describe("ErrorMessageModal", () => {
    let errorMessageService: ErrorMessageService;

    beforeEach(() => {
        errorMessageService = mock(ErrorMessageService);
    });

    const shallowRender =
        () => shallow(<ErrorMessageModal errorMessageService={instance(errorMessageService)}/>);

    it("does not show anything if there is no error message", () => {
        when(errorMessageService.getMessage()).thenReturn(null);
        const wrapper = shallowRender();

        expect(wrapper.find(".message").exists()).toBeFalsy();
    });

    it("shows a modal if an error message is available initially", () => {
        when(errorMessageService.getMessage()).thenReturn("message text");
        const wrapper = shallowRender();

        expect(wrapper.find(".message").exists()).toBeTruthy();
        expect(wrapper.find(".message .text").text()).toEqual("message text");
    });

    it("updates its state if an error message is available later", () => {
        when(errorMessageService.getMessage()).thenReturn(null);

        const wrapper = shallowRender();

        expect(wrapper.find(".message").exists()).toBeFalsy();
        const [observer] = capture(errorMessageService.addObserver).first();

        when(errorMessageService.getMessage()).thenReturn("new message text");
        observer.onErrorMessage();

        expect(wrapper.find(".message").exists()).toBeTruthy();
        expect(wrapper.find(".message .text").text()).toEqual("new message text");
    });

    it("removes the message when the button is pressed", () => {
        when(errorMessageService.getMessage()).thenReturn("message text");
        const wrapper = shallowRender();
        expect(wrapper.find(".message").exists()).toBeTruthy();

        wrapper.find(".message .close-button").first().simulate("click");

        verify(errorMessageService.pop()).once();
    });

    it("stops observing ErrorMessageService when unmounting", () => {
        const wrapper = shallowRender();

        verify(errorMessageService.addObserver(anything())).once();
        const [observer] = capture(errorMessageService.addObserver).first();

        wrapper.unmount();
        verify(errorMessageService.removeObserver(observer)).once();
    });
});