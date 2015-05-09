import 'babel/polyfill';

import AppRoutes from '../shared/Routes';
import Flux from '../shared/Flux';
import FluxComponent from 'flummox/component';
import React from 'react';
import Router from 'react-router';
import RouteUtils from '../shared/utils/RouteUtils';

const flux = new Flux();

const router = Router.create({
    routes: AppRoutes,
    location: Router.HistoryLocation
});

RouteUtils.run(router).then(async ({Handler, state}) => {
    await RouteUtils.init(state.routes, {state, flux});

    React.withContext({flux}, () => {
        React.render(<Handler {...state} />, document.getElementById('app'));
    });
}).catch(err => console.error(err));
