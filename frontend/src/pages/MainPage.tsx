import * as React from "react";
import {ReactNode} from "react";
import {LibraryService} from "../spotify/LibraryService";

interface MainPageProps {
    libraryService: LibraryService;
}

interface MainPageState {
    username: string;
    albumCount: number;
    trackCount: number;
}

export class MainPage extends React.Component<MainPageProps, MainPageState> {
    constructor(props: MainPageProps, context?: any) {
        super(props, context);
        this.state = {
            albumCount: 0,
            trackCount: 0,
            username: '',
        };
    }

    public async componentDidMount() {
        const [stats, username] = await Promise.all([
            this.props.libraryService.getStats(),
            this.props.libraryService.getUsername()
        ]);

        this.setState({
            albumCount: stats.albums,
            trackCount: stats.tracks,
            username,
        });
    }

    public render(): ReactNode {
        return (
            <div className="main-page">
                <div className="user-info">
                    Hello <span className="username">{this.state.username}</span>.
                </div>
                <div className="counts">
                    You have <span className="album-count">{this.state.albumCount}</span> albums
                    and <span className="track-count">{this.state.trackCount}</span> tracks in your library.
                </div>
            </div>
        );
    }
}
