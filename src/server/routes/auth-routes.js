import express from 'express';
import models from '../models';
import crypto from 'crypto';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import config from '../config/testing';

const routes = express.Router();
const secret = config.secret; //TODO: Store secret elsewhere and change it!!
const accessToken = config.accessToken;

// **************************** Login *******************************

var login = (user, res) => {
  var token = jwt.sign(user, secret, {
    expiresInMinutes: 1440 // expires in 24 hours
  });

  user.updateAttributes({
    last_login: new Date()
  });

  res.cookie(accessToken, token, { maxAge: 86400000, httpOnly: true }); //might need more security to defend against CSRF:
  //see : https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage/

  return res.json({
    success: true
  });
};

var currentUser = req => {
  if(!(accessToken in req.cookies)) {
    return null;
  }

  var token = req.cookies[accessToken];

  jwt.verify(token, secret, (err, decoded) => {      
    if (!err) { //if logged in already
      return decoded;
    } 
    return null;
  });
};

var isLoggedIn = req => {
  return (currentUser(req) !== null);
};

var encrypt = (password, salt) => {
  var sha512 = crypto.createHash('sha512');
  sha512.update(password + salt);
  return sha512.digest('hex');
};

routes.get('/isLoggedIn', (req, res) => {
  return res.json({isLoggedIn: isLoggedIn(req)});
});

routes.get('/currentUser', (req, res) => { //TODO: Use currentUser function above once able to figure out async
  if(!(accessToken in req.cookies)) {
    return res.json(null);
  }

  var token = req.cookies[accessToken];

  jwt.verify(token, secret, (err, decoded) => {      
    if (!err) { //if logged in already
      return res.json(decoded);
    } 
    return res.json(null);
  });
});

routes.post('/login', (req, res) => {
  var email = req.body.email;

  models.User.findOne({where: {email: email}}).then(user => {
    if(encrypt(req.body.password, user.salt) != user.password) {
      return res.json({
        success: false
      });
    }

    return login(user, res);
  });
});

routes.post('/logout', (req, res) => {
  res.clearCookie(accessToken);
  req.decoded = null;
  return res.json({
    success: true
  });
});

routes.post('/signup', (req, res) => {
  if(isLoggedIn(req)) {
    return res.redirect('/');
  }

  var email = req.body.email;
  var password = req.body.password;
  var salt = crypto.randomBytes(16);
  var hashedPassword = encrypt(password, salt);

  models.User.create({password: hashedPassword, email: email, salt: salt}).then(user => {
    return login(user, res);
  });
});

export default routes;