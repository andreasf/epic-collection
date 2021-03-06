import * as React from "react";
import {ReactNode} from "react";
import {LibraryService} from "../spotify/LibraryService";
import {Spinner} from "../components/Spinner";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import {History} from "history";
import "./MainPage.css";
import {TokenService} from "../account/TokenService";

interface MainPageProps {
    errorMessageService: ErrorMessageService;
    libraryService: LibraryService;
    history: History;
    tokenService: TokenService;
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
                        <div className="greeting">
                            Hello <span className="username">{this.state.username}</span>.
                        </div>
                        <div className="logout">
                            <button className="logout-button" onClick={() => this.onLogoutClicked()}>Logout</button>
                        </div>
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
                    <button className="find-albums" onClick={() => this.onFindAlbumsClicked()}>
                        find albums to move
                    </button>
                    <div className="explanation">
                        This will keep all your music.
                    </div>
                </div>
            </div>
        );
    }

    private onFindAlbumsClicked() {
        this.props.history.push("/find-albums");
    }

    private onLogoutClicked() {
        this.props.tokenService.logout();
    }
}
