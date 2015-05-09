import express from 'express';
import React from 'react';

import App from '../shared/App';
import Flux from '../shared/Flux';
import models from "./models";

const routes = express.Router();
        
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


routes.use(bodyParser.json()); 
routes.use(bodyParser.urlencoded({ extended: true })); 

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

routes.get('/trail', (req, res) => {
    //TODO: set trails = SELECT * FROM trail
    var trails = [1,2,3];
    res.json({'trail': trails});
});

routes.post('/trail', (req, res) => {
    res.json(req.body);
});

//*********************** API END ***********************************************************************//

//** LOGIN *************
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

routes.

// *********************


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
