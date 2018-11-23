import * as React from "react";
import {ReactNode} from "react";
import {ApiClient} from "../spotify/ApiClient";

interface MainPageProps {
    apiClient: ApiClient;
}

interface MainPageState {
    username: string;
}

export class MainPage extends React.Component<MainPageProps, MainPageState> {
    constructor(props: MainPageProps, context?: any) {
        super(props, context);
        this.state = {
            username: ''
        };
    }

    public async componentDidMount() {
        const username = await this.props.apiClient.getUsername();
        this.setState({
            username
        });
    }

    public render(): ReactNode {
        return (
            <div className="main-page">
                <div className="user-info">
                    <span className="username">{this.state.username}</span>
                </div>
                Main Page
            </div>
        );
    }
}
