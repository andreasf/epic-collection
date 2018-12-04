import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Router} from "react-router-dom";
import {Routes} from "./router/Routes";
import {TokenService} from "./account/TokenService";
import createBrowserHistory from "history/createBrowserHistory";
import {ApiClient} from "./spotify/ApiClient";
import {config} from "./config/Config";

const history = createBrowserHistory();
const tokenService = new TokenService(localStorage, location, history);
const apiClient = new ApiClient(config.apiPrefix, window, tokenService);

ReactDOM.render((
        <Router history={history}>
            <Routes tokenService={tokenService} apiClient={apiClient}/>
        </Router>
    ),
    document.getElementById('root') as HTMLElement
);
