import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import {Routes} from "./router/Routes";
import {TokenService} from "./account/TokenService";

const tokenService = new TokenService(window.localStorage);

ReactDOM.render((
        <BrowserRouter>
            <Routes tokenService={tokenService}/>
        </BrowserRouter>
    ),
    document.getElementById('root') as HTMLElement
);
