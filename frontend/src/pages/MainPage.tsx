import * as React from "react";
import {ReactNode} from "react";
import {ApiClient} from "../spotify/ApiClient";

interface MainPageProps {
    apiClient: ApiClient;
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
        const albumCount = await this.props.apiClient.getAlbumCount();
        const trackCount = await this.props.apiClient.getTrackCount();
        const username = await this.props.apiClient.getUsername();

        this.setState({
            albumCount,
            trackCount,
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
