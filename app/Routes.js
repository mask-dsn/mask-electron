import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import BoardPage from './containers/BoardPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.BOARD} component={BoardPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
