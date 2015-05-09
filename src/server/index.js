import config from './appconfig';
import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import models from "./models";

const app = express();
app.use(morgan(config.logging));
app.use(routes);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


models.sequelize.sync().then(function () {
	app.listen(config.port);
});
