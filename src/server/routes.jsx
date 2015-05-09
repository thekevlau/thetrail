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

// *********************


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
