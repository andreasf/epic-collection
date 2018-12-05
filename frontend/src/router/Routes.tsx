import * as React from "react";
import {ReactNode} from "react";
import {StaticContext} from "react-router";
import {Route, RouteComponentProps, Switch} from "react-router-dom";
import {MainPage} from "../pages/MainPage";
import {TokenService} from "../account/TokenService";
import {LibraryService} from "../spotify/LibraryService";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import {ErrorMessageModal} from "../components/ErrorMessageModal";

interface RoutesProps {
    tokenService: TokenService;
    libraryService: LibraryService;
    errorMessageService: ErrorMessageService;
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
        return <MainPage errorMessageService={this.props.errorMessageService}
                         libraryService={this.props.libraryService}/>;
    }

    public render(): ReactNode {
        return (
            <div className="router">
                <Switch>
                    <Route exact={true} path="/" render={(props) => this.renderMain(props)}/>
                </Switch>
                <ErrorMessageModal errorMessageService={this.props.errorMessageService}/>
            </div>
        );
    }
}
