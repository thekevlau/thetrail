import express from 'express';
import FluxComponent from 'flummox/component';
import React from 'react';
import Router from 'react-router';
import RouteUtils from '../shared/utils/RouteUtils';

import App from '../shared/App';
import Flux from '../shared/Flux';
import AppRoutes from '../shared/routes.js';

const routes = express.Router();

routes.use(express.static('static'));

routes.get('/monitor/ping', (req, res) => {
    res.send(`I'm working!`);
});

//*********************** API CODE DO NOT TOUCH UNLESS YOU ARE JACK OR ALEX *****************************//

// Put api code here:
routes.post('/api/whatever', (args) => {
    // Logic here.
});

//*********************** API END ***********************************************************************//


routes.get('*', (req, res) => {
    const router = Router.create({
        routes: AppRoutes,
        location: req.url,
        onError: error => {
            throw error;
        }
    });
    const flux = new Flux();

    // Process current route.
    // state.routes contains the current route and its parent.
    // Handler is the React component that handlers the current route.
    RouteUtils.run(router).then(({Handler, state}) => {
        // Run init method of current route and its parents.
        RouteUtils.init(state.routes, {state, flux}).then(() => {
            const rendered = React.withContext({flux}, () => {
                React.renderToString(<Handler {...state} />);
            });

            res.send(`
                <html>
                    <head>
                    </head>
                    <body>
                        <div id="app">
                            ${rendered}
                        </div>
                        <script type='text/javascript' src='/js/bundle.js'></script>
                    </body>
                </html>
            `);
        }).catch(err => { process.stderr.write(err.stack + '\n'); });
    }).catch(err => { process.stderr.write(err.stack + '\n'); });
});

export default routes;
