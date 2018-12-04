import * as React from "react";
import {ReactNode} from "react";
import {ApiClient} from "../spotify/ApiClient";

interface MainPageProps {
    apiClient: ApiClient;
}

interface MainPageState {
    username: string;
    trackCount: number;
}

export class MainPage extends React.Component<MainPageProps, MainPageState> {
    constructor(props: MainPageProps, context?: any) {
        super(props, context);
        this.state = {
            username: '',
            trackCount: 0
        };
    }

    public async componentDidMount() {
        const username = await this.props.apiClient.getUsername();
        const trackCount = await this.props.apiClient.getTrackCount();

        this.setState({
            username,
            trackCount
        });
    }

    public render(): ReactNode {
        return (
            <div className="main-page">
                <div className="user-info">
                    Hello <span className="username">{this.state.username}</span>.
                </div>
                <div className="counts">
                    You have <span className="track-count">{this.state.trackCount}</span>tracks in your library.
                </div>
            </div>
        );
    }
}
