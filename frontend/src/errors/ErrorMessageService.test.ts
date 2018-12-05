import {ErrorMessageObserver, ErrorMessageService} from "./ErrorMessageService";
import {instance, mock, verify} from "ts-mockito";

describe("ErrorMessageService", () => {
    let errorMessageService: ErrorMessageService;

    beforeEach(() => {
        errorMessageService = new ErrorMessageService();
    });

    it("stores multiple messages, always shows the least recent one", () => {
        expect(errorMessageService.getMessage()).toBeNull();

        errorMessageService.show("first message");
        errorMessageService.show("second message");

        expect(errorMessageService.getMessage()).toEqual("first message");
    });

    it("pop() removes the least recent message and notifies observers", () => {
        const observer = mock(Observer);

        errorMessageService.show("first message");
        errorMessageService.show("second message");

        expect(errorMessageService.getMessage()).toEqual("first message");

        errorMessageService.addObserver(instance(observer));

        errorMessageService.pop();
        expect(errorMessageService.getMessage()).toEqual("second message");

        errorMessageService.pop();
        expect(errorMessageService.getMessage()).toBeNull();

        verify(observer.onErrorMessage()).twice();
    });

    it("notifies observers of new messages", () => {
        const observer = mock(Observer);
        errorMessageService.addObserver(instance(observer));

        errorMessageService.show("new message");

        verify(observer.onErrorMessage()).once();
    });

    it("removeObserver() removes observers", () => {
        const observer = mock(Observer);
        errorMessageService.addObserver(instance(observer));
        errorMessageService.removeObserver(instance(observer));

        errorMessageService.show("new message");

        verify(observer.onErrorMessage()).never();
    });
});

class Observer implements ErrorMessageObserver {
    public onErrorMessage() {
        // nothing
    }
}