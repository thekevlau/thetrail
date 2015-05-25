import bodyParser from 'body-parser';
import config from './appconfig';
import express from 'express';
import FluxComponent from 'flummox/component';
import React from 'react';
import Router from 'react-router';
import RouteUtils from '../shared/utils/RouteUtils';

import App from '../shared/App';
import Flux from '../shared/Flux';
import AppRoutes from '../shared/routes.js';
import ApiRoutes from './routes/api';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

const routes = express.Router();

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true }));

routes.use(express.static(config.static));

routes.use(session({ secret: 'superSeCret' }));
routes.use(passport.initialize());
routes.use(passport.session());

routes.get('/monitor/ping', (req, res) => {
    res.send(`I'm working!`);
});

routes.use('/api', ApiRoutes);

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
            React.withContext({flux}, () => {
                const rendered = React.renderToString(<Handler {...state} />);
                res.send(`
                    <html>
                        <head>
                            <link rel="stylesheet" type="text/css" href="/css/main.css" />
                        </head>
                        <body>
                            <div id="app">
                                ${rendered}
                            </div>
                            <script type="text/javascript" src="/js/bundle.js"></script>
                        </body>
                    </html>
                `);
            });
        }).catch(err => { process.stderr.write(err.stack + '\n'); });
    }).catch(err => { process.stderr.write(err.stack + '\n'); });
});

export default routes;
