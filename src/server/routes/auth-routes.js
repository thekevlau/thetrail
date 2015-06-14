import express from 'express';
import models from '../models';
import crypto from 'crypto';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import config from '../appconfig';

const routes = express.Router();
const secret = config.secret;
const accessToken = config.accessToken;

// **************************** Login *******************************

const login = (user, res) => {
    const token = jwt.sign(user, secret, {
        expiresInMinutes: 1440 // Expires in 24 hours.
    });

    user.updateAttributes({
        last_login: new Date()
    });

    // This might need more security to defend against CSRF.
    // For more info, see : https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage/
    res.cookie(accessToken, token, { maxAge: 86400000, httpOnly: true });

    return res.json({
        success: true
    });
};

const encrypt = (password, salt) => {
    const sha512 = crypto.createHash('sha512');
    sha512.update(password + salt);
    return sha512.digest('hex');
};

routes.get('/isLoggedIn', (req, res) => {
    return res.json({isLoggedIn: req.user !== null});
});

routes.get('/currentUser', (req, res) => {
    return res.json(req.user);
});

routes.post('/login', (req, res) => {
    const email = req.body.email;

    models.User.findOne({where: {email: email}}).then(user => {
        if (encrypt(req.body.password, user.salt) != user.password){
            return res.json({
                success: false
            });
        }

        return login(user, res);
    });
});

routes.post('/logout', (req, res) => {
    res.clearCookie(accessToken);
    return res.json({
        success: true
    });
});

routes.post('/signup', (req, res) => {
    if (req.user !== null){
        return res.redirect('/');
    }

    const email = req.body.email;
    const password = req.body.password;
    const salt = crypto.randomBytes(16);
    const hashedPassword = encrypt(password, salt);

    models.User.create({password: hashedPassword, email: email, salt: salt}).then(user => {
        return login(user, res);
    });
});

export default routes;