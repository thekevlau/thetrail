import express from 'express';
import React from 'react';

import App from '../shared/App';
import Flux from '../shared/Flux';
import models from "../../models";

const routes = express.Router();

routes.get('/monitor/ping', (req, res) => {
    res.send(`I'm working!`);
});

routes.get('/dbtest', (req, res) => {
  models.User.findOrCreate({
    where: {username: 'timtimpei'}
  }).then(function(user) {
    res.send(user);
  });
});

//*********************** API CODE DO NOT TOUCH UNLESS YOU ARE JACK OR ALEX *****************************//

// Put api code here:
routes.post('/api/whatever', (args) => {
    // Logic here.
});

//*********************** API END ***********************************************************************//

routes.get('*', async (req, res) => {
    const router = Router.create({
        routes: routes,
        location: req.url,
        onError: error => {
            throw error;
        }
    });
    const flux = new Flux();

    // Process current route.
    // state.routes contains the current route and its parent.
    // Handler is the React component that handlers the current route.
    const {Handler, state} = await RouteUtils.run(router);
    // Run init method of current route and its parents.
    await RouteUtils.init(state.routes, {state, flux});

    const rendered = React.renderToString(Handler);
    res.send(`
        <html>
            <head>
            </head>
            <body>
                ${rendered}
                <script type='text/javascript' src='./bundle.js'></script>
            </body>
        </html>
    `);
});

export default routes;
