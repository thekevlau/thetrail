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
var session = require('express-session')

routes.use(bodyParser.json()); 
routes.use(bodyParser.urlencoded({ extended: true }));

routes.use(express.static('static'));

routes.use(session({ secret: 'superSeCret' }));
routes.use(passport.initialize());
routes.use(passport.session());

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
    var listOfTags = req.body.tags;
    models.Trail.create({name: data.name, 
        description: data.description, date_created: new Date(),
        forked_from: data.forked_from, num_views: 0}).then(function(result){
            req.user.addTrail(result);
            for(var tagName in listOfTags) {
                models.Tag.findOrCreate({where: {name: tagName}}).then(function(tag) {
                    models.Trail.find(result.id).then(function(trail){
                        trail.addTag(tag);
                    })
                }); 
            }
            res.json(result);
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

routes.post('/trail/:id([0-9]+)', function(req, res){
    var action = req.query.action;
    var trailId = req.params.id;
    if (action == 'fork') {
        if(!(req.user)){
            res.status(401).send('Unauthorized');
        }
        models.Trail.find(trailId).then(function(trail) {
            models.Trail.create({name: trail.name, 
                description: trail.description, date_created: new Date(),
                forked_from: trail.getUsers()[0], num_views: 0}).then(function(result) {
                    req.user.addTrail(result);
                    trail.getResources().then(function(resources) {
                        for (var resource in resources) {
                            result.addResource(resource, {order: resource.order, annotations: resource.annotations});
                        }
                        res.json(result);
                    });
                });
            });
    } else {
        res.status(400).send('Sorry, we cannot accept that action');
    }
});

routes.put('/trail/:id([0-9]+)', (req, res) =>{  
    var trailId = req.params.id;
    var data = req.body;
    var newListOfTags = req.body.newTags;
    var listOfDeletedTags = req.body.deletedTags;
    models.Trail.find(trailId).then(function(trail) {s
        if (trail) {
            trail.updateAttributes({
                name: data.name, description: data.description, 
                    date_created: data.date_created, forked_from: data.forked_from, 
                    num_views: data.num_views
                }).then(function() {
                    for(var tagName in newListOfTags) {
                        models.Tag.findOrCreate({where: {name: tagName}}).then(function(tag) {
                            trail.addTag(tag);
                        }); 
                    }
                    for(var tagName in listOfDeletedTags) {
                        models.Tag.findOrCreate({where: {name: tagName}}).then(function(tag) {
                            trail.removeTag(tag);
                        }); 
                    }
                res.send("Success!");
            });
        }
    });
});

routes.delete('/trail/:id([0-9]+)', (req, res) => {
    var trailId = req.params.id;
    models.Trail.find(trailId).on('success', function(trail){
        trail.destroy().on('success', function(a) {
            if (a && a.deletedAt){
                res.send("SUCCESS!");
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

    models.User.find(userId).then(function(user) {
        if (user) {
            user.updateAttributes({
                name: data.name, first_name: data.first_name, 
                    last_name: data.last_name, email: data.email, 
                    url: data.url, description: data.description, dob: data.dob, 
                    education: data.education, field: data.field, gender: data.gender
            }).then(function() {
                res.send("Success!")
            })
        }
    });
});

routes.delete('/user/:id([0-9]+)', function(req, res) {
    var userId = req.params.id;
    models.User.find(userId).then(function(user) {
        //TODO: Delete all trails + steps + unlink resources?
        user.destroy().then(function(action){
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
    var trailId = req.body.trailId;
    var annotations = req.body.annotations;

    models.Resource.findOrCreate({ where: { data: data.data, type: data.type } })
        .then(function(resource){
            models.Trail.find(trailId).then(function(trail) {
                trail.getResources().then(function(resources) {
                    resource[0].order = resources.length + 1;
                    resource[0].annotations = annotations;
                    trail.addResource(resource[0]);
                    res.json(resource[0]);
                })
            });
        }
    );
});

routes.put('/step/:trailId([0-9]+)', function(req, res) {
    var trailId = req.params.trailId;
    var resources = req.body.resources; // array of lists

    for (var i = 0; i < resources.length; i++) {
        resources[i].order = i;
    }
    models.Trail.find(trailId).then(function(trail) {
        trail.setResources(resources, {order: 0, annotations: ''}).then(function(el) {
            res.json(trail);
        });
    });
});

routes.delete('/step/:trailId([0-9]+)/:order([0-9]+)', function(req, res) {
    //TODO: unlink with resource and trail, decrement/increment other steps in that trail, destroy
});

// *************************** Tags *******************************

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
  models.User.find(id).then(function (user) {
    done(null, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    models.User.find({ where: {email: username} }).then(function(user) {
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
        models.User.find(req.user.id).then(function(user) {
            if (user) {
                user.updateAttributes({
                    last_login: new Date()
                });
                res.json(req.user);
            }
        });
    }
);

routes.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send("Success!");
});

routes.get('/signup', (req, res) => {
    res.send("Sign up!");
});

routes.post('/signup', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    models.User.create({email: email, password: password}).then(function(result) {
        var userId = result.dataValues.id;
        models.User.find(userId).then(function(user) {
            req.login(user, function() {
                res.json(req.user);
            })
        })
    });
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
