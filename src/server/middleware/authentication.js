import config from '../appconfig';
import jwt from 'jsonwebtoken';

const secret = config.secret;
const accessToken = config.accessToken;

const currentUser = req => {
    if (!(accessToken in req.cookies)){
        return null;
    }

    const token = req.cookies[accessToken];

    try {
        return jwt.verify(token, secret);
    }
    catch (err){
        console.err(err.stack);
        return null;
    }
};

export default (req, res, next) => {
    req.user = currentUser(req);
    next();
};