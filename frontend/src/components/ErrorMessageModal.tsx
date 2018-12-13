import * as React from "react";
import {ReactNode} from "react";
import {ErrorMessageObserver, ErrorMessageService} from "../errors/ErrorMessageService";
import "./ErrorMessageModal.css";

export interface ErrorMessageProps {
    errorMessageService: ErrorMessageService;
}

export interface ErrorMessageState {
    message: string | null;
}

export class ErrorMessageModal extends React.Component<ErrorMessageProps, ErrorMessageState> implements ErrorMessageObserver {
    constructor(props: ErrorMessageProps, context?: any) {
        super(props, context);
        this.state = {
            message: null
        };
    }

    public componentDidMount() {
        this.props.errorMessageService.addObserver(this);
        this.updateMessage();
    }

    public componentWillUnmount() {
        this.props.errorMessageService.removeObserver(this);
    }

    public onErrorMessage() {
        this.updateMessage();
    }

    public render(): ReactNode {
        return <div className="error-message">
            {this.renderMessage()}
        </div>;
    }

    private renderMessage(): ReactNode {
        if (!this.state.message) {
            return null;
        }

        return (
            <div className="message">
                <div className="text">{this.state.message}</div>
                <div className="close-button" onClick={() => this.onClose()}>
                    close
                </div>
            </div>
        );
    }

    private onClose() {
        this.props.errorMessageService.shift();
    }

    private updateMessage() {
        this.setState({
            message: this.props.errorMessageService.getMessage()
        });
    }
}