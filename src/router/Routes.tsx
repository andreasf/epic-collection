import * as React from "react";
import {ReactNode} from "react";
import {StaticContext} from "react-router";
import {Route, RouteComponentProps, Switch} from "react-router-dom";
import {MainPage} from "../pages/MainPage";
import {TokenService} from "../account/TokenService";

interface RoutesProps {
    tokenService: TokenService
}

export class Routes extends React.Component<RoutesProps, {}> {
    constructor(props: RoutesProps, context?: any) {
        super(props, context);
    }

    public componentDidMount() {
        if (this.props.tokenService.isOauthCallback()) {
            this.props.tokenService.handleOauthCallback();
        }

        if (!this.props.tokenService.isLoggedIn()) {
            this.props.tokenService.redirectToLogin();
        }
    }

    public renderMain(props: RouteComponentProps<any, StaticContext, any>): ReactNode {
        return <MainPage/>;
    }

    public render(): ReactNode {
        return (
            <div className="router">
                <Switch>
                    <Route exact={true} path="/" render={this.renderMain}/>
                </Switch>
            </div>
        );
    }
}
