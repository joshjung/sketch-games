import React from 'react';
import { Route } from 'react-router';

import ApplicationLayout from './layout/ApplicationLayout';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import LoginPage from './pages/LoginPage';
import NewUserPage from './pages/NewUserPage';
import EditGamePage from './pages/EditGamePage';
import GamesPage from './pages/GamesPage';

export default (
  <Route path="/">
    <ApplicationLayout>
      <Route path="/" exact component={HomePage} />
      <Route path="/games" exact component={GamesPage} />
      <Route path="/games/new" exact component={EditGamePage} />
      <Route path="/games/:userId" exact component={GamesPage} />
      <Route path="/games/edit/:id" exact component={EditGamePage} />
      <Route path="/games/playground/:id" exact component={PlaygroundPage} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/user/create" exact component={NewUserPage} />
      <Route path="/playground" component={PlaygroundPage} />
    </ApplicationLayout>
  </Route>
);
