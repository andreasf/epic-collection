export class ErrorMessageService {
    private messages: string[] = [];
    private observers: ErrorMessageObserver[] = [];

    public show(message: string) {
        this.messages.push(message);
        this.notifyObservers();
    }

    public getMessage(): string | null {
        if (this.messages.length > 0) {
            return this.messages[0];
        }
        return null;
    }

    public shift() {
        this.messages = this.messages.splice(1);
        this.notifyObservers();
    }

    public addObserver(observer: ErrorMessageObserver) {
        this.observers.push(observer);
    }

    public removeObserver(observerToRemove: ErrorMessageObserver) {
        this.observers = this.observers.filter((observer) => observer !== observerToRemove);
    }

    private notifyObservers() {
        for (const observer of this.observers) {
            observer.onErrorMessage();
        }
    }
}

export interface ErrorMessageObserver {
    onErrorMessage: () => void;
}