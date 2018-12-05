import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Router} from "react-router-dom";
import {Routes} from "./router/Routes";
import {TokenService} from "./account/TokenService";
import createBrowserHistory from "history/createBrowserHistory";
import {ApiClient} from "./spotify/ApiClient";
import {config} from "./config/Config";
import {LibraryService} from "./spotify/LibraryService";

const history = createBrowserHistory();
const tokenService = new TokenService(localStorage, location, history);
const apiClient = new ApiClient(config.apiPrefix, window, tokenService);
const libraryService = new LibraryService(apiClient);

ReactDOM.render((
        <Router history={history}>
            <Routes tokenService={tokenService} libraryService={libraryService}/>
        </Router>
    ),
    document.getElementById('root') as HTMLElement
);
