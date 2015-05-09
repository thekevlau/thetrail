import express from 'express';
import FluxComponent from 'flummox/component';
import React from 'react';
import Router from 'react-router';
import RouteUtils from '../shared/utils/RouteUtils';

import App from '../shared/App';
import Flux from '../shared/Flux';
import AppRoutes from '../shared/routes.js';
import models from "./models";

const routes = express.Router();

var bodyParser = require('body-parser');
routes.use(bodyParser.json()); 
routes.use(bodyParser.urlencoded({ extended: true }));

routes.use(express.static('static'));

routes.get('/monitor/ping', (req, res) => {
    res.send(`I'm working!`);
});

//*********************** API CODE DO NOT TOUCH UNLESS YOU ARE JACK OR ALEX *****************************//

// Put api code here:



//trail get
routes.get('/trail/:id([0-9]+)', function(req, res){
    var trailId = req.params.id;
    models.Trail.find(trailId).then(function(trail) {
        if (trail!=null) {

            res.json(trail);

        }
        else {
            res.json(trail);
            res.status(404).send('Sorry, we cannot find that!');
        }

    });
});


//trail post
routes.post('/trail', (req, res) => {  
    //TODO: sql
    //res.json(req.body);
    var js = req.body;
    console.log(js);

    //res.send(js.name);
    models.Trail.create({name: js.name, 
        description: js.description, date_created: js.date_created,
        forked_from: js.forked_from, num_views: js.num_views}).then(function(trail){
            res.send(trail.id);
        });

    //res.send(jsonvalue.ID);
    //todo  var trail = select from where id = 
    //res.json(jsonvalue);

});

//trail put
routes.put('/trail/:id([0-9]+)', (req, res) =>{  
    var trailId = req.params.id;
    //TODO: sql
    //var js = json.parse(req.body);

    res.send(js.name);
    models.Trail.upsert({name: js.name, 
        description: js.description, date_created: js.date_created,
        forked_from: js.forked_from, num_views: num_views}).then(function(){

        });

    //res.send(jsonvalue.ID);
    //todo  var trail = select from where id = 
    //res.json(jsonvalue);

});

routes.delete('/trail/:id([0-9]+)', (req, res) => {
    var trailId = req.params.id;
    models.Trail.find(trailId).on('success', function(trail){
        models.destroy().on('success', function(a) {
            if (a && a.deletedAt){
            }
        });
    });
});



//user get

routes.get('/user/:id([0-9]+)', function(req, res){
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

routes.get('/step/:id([0-9]+)', function(req, res){
    var stepId = req.params.id;
    models.Step.find({
        where: {id: stepId}
    }).then(function(step) {
        if (trail!=null) {
            res.json(step);

        }
        else {
            res.status(404).send('Sorry, we cannot find that!');
        }

    });
});

//step put




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
            React.withContext({flux}, () => {
                const rendered = React.renderToString(<Handler {...state} />);
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
            });
        }).catch(err => { process.stderr.write(err.stack + '\n'); });
    }).catch(err => { process.stderr.write(err.stack + '\n'); });
});

export default routes;
