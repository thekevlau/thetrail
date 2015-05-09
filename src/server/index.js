import config from './appconfig';
import express from 'express';
import morgan from 'morgan';
import routes from './routes';

const app = express();
app.use(morgan('combined'));

app.use(routes);

app.listen(config.port);
