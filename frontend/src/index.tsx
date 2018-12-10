import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Router} from "react-router-dom";
import {Routes} from "./router/Routes";
import {TokenService} from "./account/TokenService";
import createBrowserHistory from "history/createBrowserHistory";
import {ApiClient} from "./spotify/ApiClient";
import {config, math} from "./config/Config";
import {LibraryService} from "./spotify/LibraryService";
import {ErrorMessageService} from "./errors/ErrorMessageService";
import {ErrorHandlingFetch} from "./spotify/ErrorHandlingFetch";
import {RandomChoice} from "./RandomChoice";

const history = createBrowserHistory();
const tokenService = new TokenService(localStorage, location, history);
const errorHandlingFetch = new ErrorHandlingFetch(window, tokenService);
const apiClient = new ApiClient(config.apiPrefix, errorHandlingFetch, tokenService);
const randomChoice = new RandomChoice(math);
const libraryService = new LibraryService(apiClient, randomChoice);
const errorMessageService = new ErrorMessageService();

ReactDOM.render((
        <Router history={history}>
            <Routes errorMessageService={errorMessageService}
                    libraryService={libraryService}
                    tokenService={tokenService}/>
        </Router>
    ),
    document.getElementById('root') as HTMLElement
);
