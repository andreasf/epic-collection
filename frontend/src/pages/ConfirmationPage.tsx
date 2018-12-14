import * as React from "react";
import {ReactNode} from "react";
import {LibraryService} from "../spotify/LibraryService";
import {History} from "history";
import {Spinner} from "../components/Spinner";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import "./main.css";
import "./ConfirmationPage.css";

interface ConfirmationPageProps {
    errorMessageService: ErrorMessageService;
    history: History;
    libraryService: LibraryService;
}

interface ConfirmationState {
    moving: boolean;
}

export class ConfirmationPage extends React.Component<ConfirmationPageProps, ConfirmationState> {
    constructor(props: ConfirmationPageProps, context?: any) {
        super(props, context);

        this.state = {
            moving: false
        };
    }

    public render(): ReactNode {
        const count = this.props.libraryService.getSelectedCount();
        const spinner = this.state.moving ? <Spinner/> : null;

        return (
            <div className="confirmation-page">
                {spinner}
                <div className="prompt">
                    <p>
                        Move <span className="selected-count">{count}</span> tracks
                        and albums from your library to a new playlist?
                    </p>
                    <p className="explanation">
                        This will free up space and keep all tracks available
                        through the playlist.
                    </p>
                </div>
                <div className="buttons">
                    <button className="move-button" onClick={() => this.onMoveClicked()}>
                        move
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

    private async onMoveClicked() {
        this.setState({moving: true});

        try {
            await this.props.libraryService.commit();
            this.props.history.push("/home");

        } catch (e) {
            this.props.errorMessageService.show(`error moving albums: ${e.message}`);
            this.setState({moving: false});
        }
    }
}