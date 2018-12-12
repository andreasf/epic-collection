import * as React from "react";
import {ReactNode} from "react";
import "./main.css";
import "./ConfirmationPage.css";
import {LibraryService} from "../spotify/LibraryService";
import {History} from "history";
import {Spinner} from "../components/Spinner";
import {ErrorMessageService} from "../errors/ErrorMessageService";

interface ConfirmationPageProps {
    errorMessageService: ErrorMessageService;
    history: History;
    libraryService: LibraryService;
}

interface ConfirmationState {
    deleting: boolean;
}

export class ConfirmationPage extends React.Component<ConfirmationPageProps, ConfirmationState> {
    constructor(props: ConfirmationPageProps, context?: any) {
        super(props, context);

        this.state = {
            deleting: false
        };
    }

    public render(): ReactNode {
        const count = this.props.libraryService.getSelectedCount();
        const spinner = this.state.deleting ? <Spinner/> : null;

        return (
            <div className="confirmation-page">
                {spinner}
                <div className="prompt">
                    Remove <span className="selected-count">{count}</span> tracks
                    and albums from library?
                </div>
                <div className="buttons">
                    <button className="remove-button" onClick={() => this.onRemoveClicked()}>
                        remove
                    </button>
                    <button className="cancel-button" onClick={() => this.onCancelClicked()}>
                        cancel
                    </button>
                </div>
            </div>
        );
    }

    private onCancelClicked() {
        this.props.history.push("/find-albums");
    }

    private async onRemoveClicked() {
        this.setState({deleting: true});

        try {
            await this.props.libraryService.commit();
            this.props.history.push("/");

        } catch (e) {
            this.props.errorMessageService.show(`error removing albums: ${e.message}`);
            this.setState({deleting: false});
        }
    }
}