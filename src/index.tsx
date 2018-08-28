import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Router} from "react-router-dom";
import {Routes} from "./router/Routes";
import {TokenService} from "./account/TokenService";
import createBrowserHistory from "history/createBrowserHistory";

const history = createBrowserHistory();
const tokenService = new TokenService(localStorage, location, history);

ReactDOM.render((
        <Router history={history}>
            <Routes tokenService={tokenService}/>
        </Router>
    ),
    document.getElementById('root') as HTMLElement
);
