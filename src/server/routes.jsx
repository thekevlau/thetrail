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
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

routes.use(bodyParser.json()); 
routes.use(bodyParser.urlencoded({ extended: true }));

routes.use(express.static('static'));

routes.get('/monitor/ping', (req, res) => {
    res.send(`I'm working!`);
});

//*********************** API CODE DO NOT TOUCH UNLESS YOU ARE JACK OR ALEX *****************************//

// ******************* TRAIL **********************
routes.get('/trail', (req, res) => {
    models.Trail.all().then(function(trails) {
        res.json(trails);
    })
});

routes.post('/trail', (req, res) => {  
    var data = req.body;
    //TODO: NEED TO SET USER
    models.Trail.create({name: data.name, 
        description: data.description, date_created: new Date().format("yyyy/mm/dd"),
        forked_from: data.forked_from, num_views: data.num_views}).success(function(trail){
            res.send(trail.id);
        });
});

routes.get('/trail/:id([0-9]+)', function(req, res){
    var trailId = req.params.id;
    models.Trail.find({ where: {id: trailId}, include: [{ all: true }]}).then(function(trail) {
        if (trail != null) {
            res.json(trail);
        } else {
            res.status(404).send('Sorry, we cannot find that!');
        }
    });
});

routes.put('/trail/:id([0-9]+)', (req, res) =>{  
    var trailId = req.params.id;
    var data = req.body;

    models.Trail.find(trailId).success(function(trail) {
        if (trail) {
            trail.updateAttributes({
                name: data.name, description: data.description, 
                    date_created: data.date_created, forked_from: data.forked_from, 
                    num_views: data.num_views
                }).success(function() {
                res.send("Success!")
            });
        }
    });
});

routes.delete('/trail/:id([0-9]+)', (req, res) => {
    var trailId = req.params.id;
    //TODO: set ownership as deleted
    models.Trail.find(trailId).on('success', function(trail){
        trail.destroy().on('success', function(a) {
            if (a && a.deletedAt){
            }
        });
    });
});

// *********************** USER *******************************

routes.get('/user', function(req, res) {
    models.User.all().then(function(users) {
        res.json(users);
    })
});

routes.get('/user/:id([0-9]+)', function(req, res) {
    var userId = req.params.id;
    models.User.find(userId).then(function(user) {
        if (trail != null) {
            res.json(user);
        } else {
            res.status(404).send('Sorry, we cannot find that!');
        }
    });
});

routes.put('/user/:id([0-9]+)', function(req, res) {
    var userId = req.params.id;
    var data = req.body;

    models.User.find(userId).success(function(user) {
        if (user) {
            user.updateAttributes({
                name: data.name, first_name: data.first_name, 
                    last_name: data.last_name, email: data.email, 
                    url: data.url, description: data.description, dob: data.dob, 
                    education: data.education, field: data.field, gender: data.gender
            }).success(function() {
                res.send("Success!")
            })
        }
    });
});

routes.delete('/user/:id([0-9]+)', function(req, res) {
    var userId = req.params.id;
    models.User.find(userId).success(function(user) {
        //TODO: Delete all trails + steps + unlink resources?
        user.destroy().success(function(action){
            //TODO: DO SOMETHING
        });
    });
});

// ************************ Resources & Steps *********************

routes.get('/resource', function(req, res) {
    models.Resource.all().then(function(resources) {
        res.json(resources);
    })
});

routes.post('/resource', function(req, res) {
    var data = req.body;
    models.Resource.findOrCreate({ where: { data: data.data, type: data.type } })
        .success(function(resource){
            models.Step.create({ order: data.order, annotations: data.annotations }).success(function(resource) {
                //TODO: LINK STEP WITH TRAIL + RESOURCE
                //TODO: DO SOMETHING HERE
            });
        }
    );
});

routes.put('/step/:trailId([0-9]+)/:order([0-9]+)', function(req, res) {
    var trailId = req.params.trailId;
    var order = req.params.order;
    //TODO: Need to correctly get step based on trail Id
    models.Step.find({where: { order: order, trailId: trailId}}).then(function(step) {
        step.updateAttributes({annotations: req.body.annotations}).success(function(step) {
            //TODO: DO SOMETHING HERE
        });
    });
});

routes.delete('/step/:trailId([0-9]+)/:order([0-9]+)', function(req, res) {
    //TODO: unlink with resource and trail, decrement/increment other steps in that trail, destroy
});

// *************************** Tags *******************************

routes.post('/tag', (req, res) => {
    var data = req.body; //should this have an array of tag names where we can then run a for loop?
    models.Tag.findOrCreate({where: {name: data.name}}).success(function(tag) {
        //TODO: LINK TAG WITH TRAIL
    }); 
});

routes.delete('/tag', (req, res) => {
    var data = req.body; //should this have an array of tag names as well?
    //TODO: UNLINK TAG WITH TRAIL
});

routes.get('/tag', (req, res) => {
    var name = req.query.name;
    var arrayOfTags = req.split('+');
    var arrayOfTrails = [];
    arrayOfTags.forEach(function(element, index, array) {
        models.Tag.find({ where: { name: element }, include: [ Trail ], order: [ [ Trail, 'id' ] ] }).then(function(tag) {
            var listOfTrails = tag.getTrails();
            var arrayOfTrailIds = arrayOfTrails.map(function(trail) { return trail.id });
            for (let trail in listOfTrails) {
                if (arrayOfTrailIds.indexOf(trail.id) != -1) {
                    arrayOfTrails.push(trail);
                }
            }
        });
    });
    arrayOfTrails.sort(function(a, b) {
        a.getLikes().length - b.getLikes().length;
    });
    return arrayOfTrails;
});

// **************************** Login *******************************

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find(id).then(function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.find({ where: {email: username} }).then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!(user.password == password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
}));

routes.get('/login', (req, res) => {
    res.send("Login");
});

routes.post('/login', 
    passport.authenticate('local'), //returns 401 if fails
    (req, res) => {
        models.User.find(userId).success(function(user) {
            if (user) {
                user.updateAttributes({
                    last_login: new Date().format("yyyy/mm/dd")
                })
            }
        });
        res.redirect('/user/' + req.user.id);
    }
);

routes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

routes.get('/signup', (req, res) => {
    res.send("Sign up!");
});

routes.post('/signup', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    models.User.create({email: email, password: password})
    .error(function(err){
        res.status(500);
    })
    .success(function(result) {
        passport.authenticate('local'); //sets req.user to user
        res.redirect('/user/' + req.user.id);
    });
});

// **************************** Like *******************************



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
