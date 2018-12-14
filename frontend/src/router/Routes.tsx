import * as React from "react";
import {ReactNode} from "react";
import {StaticContext} from "react-router";
import {Route, RouteComponentProps, Switch} from "react-router-dom";
import {MainPage} from "../pages/MainPage";
import {TokenService} from "../account/TokenService";
import {LibraryService} from "../spotify/LibraryService";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import {ErrorMessageModal} from "../components/ErrorMessageModal";
import {AlbumPage} from "../pages/AlbumPage";
import {ConfirmationPage} from "../pages/ConfirmationPage";
import {LandingPage} from "../pages/LandingPage";

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
    }

    public render(): ReactNode {
        return (
            <div className="router">
                <Switch>
                    <Route exact={true} path="/" render={(props) => this.renderLandingPage(props)}/>
                    <Route exact={true} path="/home" render={(props) => this.renderMain(props)}/>
                    <Route exact={true} path="/find-albums" render={(props) => this.renderAlbumPage(props)}/>
                    <Route exact={true} path="/confirm-moving" render={(props) => this.renderConfirmationPage(props)}/>
                </Switch>
                <ErrorMessageModal errorMessageService={this.props.errorMessageService}/>
            </div>
        );
    }

    private renderLandingPage(props: RouteComponentProps<any, StaticContext, any>): ReactNode {
        return <LandingPage/>;
    }

    private renderMain(props: RouteComponentProps<any, StaticContext, any>): ReactNode {
        return <MainPage errorMessageService={this.props.errorMessageService}
                         libraryService={this.props.libraryService}
                         history={props.history}/>;
    }

    private renderAlbumPage(props: RouteComponentProps<any, StaticContext, any>): ReactNode {
        return <AlbumPage errorMessageService={this.props.errorMessageService}
                          history={props.history}
                          libraryService={this.props.libraryService}/>;
    }

    private renderConfirmationPage(props: RouteComponentProps<any, StaticContext, any>): ReactNode {
        return <ConfirmationPage errorMessageService={this.props.errorMessageService}
                                 history={props.history}
                                 libraryService={this.props.libraryService}/>;
    }
}
