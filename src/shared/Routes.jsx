import React from 'react';
import { Route, DefaultRoute } from 'react-router';

import App from './App';
import Home from './components/Home';
import Test from './components/Test';
import Trail from './components/Trail';
import AddTrail from './components/AddTrail';

export default (
    <Route handler={App} path="/">
        <DefaultRoute handler={Home} />
        <Route name="test" path="test" handler={Test} />
        <Route name="addTrail" path="trail/add" handler={AddTrail} />
        <Route name="trail" path="trail/:trailId" handler={Trail} />
    </Route>
);
