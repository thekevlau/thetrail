import config from './appconfig';
import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import models from "./models";

const app = express();
app.use(morgan(config.logging));
app.use('/api', routes);


models.sequelize.sync().then(function () {
	app.listen(config.port);
});