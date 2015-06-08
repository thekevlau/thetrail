require('source-map-support').install();
require('node-jsx').install();
require('babel/polyfill');

import config from './appconfig';
import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import models from './models';
import cookieParser from 'cookie-parser';

const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(routes);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

models.sequelize.sync().then(function () {
	app.listen(config.port);
    console.log(`Listening on port ${config.port}`);
});
