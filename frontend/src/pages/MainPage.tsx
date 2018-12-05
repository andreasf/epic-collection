import * as React from "react";
import {ReactNode} from "react";
import {LibraryService} from "../spotify/LibraryService";
import {Spinner} from "../components/Spinner";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import "./MainPage.css";

interface MainPageProps {
    errorMessageService: ErrorMessageService;
    libraryService: LibraryService;
}

interface MainPageState {
    albumCount: number;
    remaining: number;
    trackCount: number;
    username: string;
    loading: boolean;
}

export class MainPage extends React.Component<MainPageProps, MainPageState> {
    constructor(props: MainPageProps, context?: any) {
        super(props, context);
        this.state = {
            albumCount: 0,
            remaining: 0,
            trackCount: 0,
            username: '',
            loading: true,
        };
    }

    public async componentDidMount() {
        try {
            const [stats, username] = await Promise.all([
                this.props.libraryService.getStats(),
                this.props.libraryService.getUsername()
            ]);

            this.setState({
                albumCount: stats.albums,
                remaining: stats.remaining,
                trackCount: stats.tracks,
                username,
                loading: false,
            });
        } catch (e) {
            this.props.errorMessageService.show(e.message);
        }
    }
    public render(): ReactNode {
        const spinner = this.state.loading ? <Spinner/> : null;

        return (
            <div className="main-page">
                {spinner}
                <div className="top">
                    <div className="user-info">
                        Hello <span className="username">{this.state.username}</span>.
                    </div>
                    <div className="counts">
                        You have <span className="album-count">{this.state.albumCount}</span> albums
                        and <span className="track-count">{this.state.trackCount}</span> tracks in your library.
                    </div>
                </div>
                <div className="remaining">
                    <div className="remaining-items">{this.state.remaining}</div>
                    <span className="remaining-label">tracks remaining</span>
                </div>
                <div className="bottom">
                    &nbsp;
                </div>
            </div>
        );
    }
}
