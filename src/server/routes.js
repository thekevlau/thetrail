import express from 'express';
import React from 'react';

import App from '../shared/App';
import Flux from '../shared/Flux';
import models from "./models";

const routes = express.Router();

routes.get('/monitor/ping', (req, res) => {
    res.send(`I'm working!`);
});

var bodyParser = require('body-parser');
routes.use(bodyParser.urlencoded({ extended: true }));
routes.use(bodyParser.json()); // for parsing application/json

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



//trail get
routes.get('/trail/:id([0-9]+)', function(req, res){
    var trailId = req.params.id;
    models.Trail.find({
        where: {id: trailId}
    }).then(function(trail) {
        if (trail!=null) {
            res.json(trail);

        }
        else {
            res.status(404).send('Sorry, we cannot find that!');
        }

    });
});


//trail post
routes.put('/trail', (req, res) =>{  
    //TODO: sql
    var jsonvalue = req.body;

    models.Trail.upsert(req.body, [])
    //res.send(jsonvalue.ID);
    //todo  var trail = select from where id = 
    res.json(jsonvalue);

});

//user get

routes.get('user//:id([0-9]+)', function(req, res){
    var userId = req.params.id;
    models.User.find({
        where: {id: userId}
    }).then(function(user) {
        if (trail!=null) {
            res.json(user);

        }
        else {
            res.status(404).send('Sorry, we cannot find that!');
        }

    });
});

//user put

//step get

routes.get('/trail/:id([0-9]+)', function(req, res){
    var trailId = req.params.id;
    models.Trail.find({
        where: {id: trailId}
    }).then(function(trail) {
        if (trail!=null) {
            res.json(trail);

        }
        else {
            res.status(404).send('Sorry, we cannot find that!');
        }

    });
});

//step put




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
