import React from 'react';
import { Route, Switch } from 'react-router';

import ApplicationLayout from './layout/ApplicationLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PlaygroundPage from './pages/PlaygroundPage';
import PlayPage from './pages/PlayPage';
import LoginPage from './pages/LoginPage';
import NewUserPage from './pages/NewUserPage';
import EditGamePage from './pages/EditGamePage';
import GamesPage from './pages/GamesPage';
import APIPage from "./pages/APIPage";

export default (
  <Route path="/">
    <ApplicationLayout>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/games/new" exact component={EditGamePage} />
        <Route path="/games/:filter" exact component={GamesPage} />
        <Route path="/games" exact component={GamesPage} />
        <Route path="/games/:userId" exact component={GamesPage} />
        <Route path="/games/edit/:id" exact component={EditGamePage} />
        <Route path="/games/playground/:id" exact component={PlaygroundPage} />
        <Route path="/games/play/:id" exact component={PlayPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/user/create" exact component={NewUserPage} />
        <Route path="/about" exact component={AboutPage} />
        <Route path="/api" exact component={APIPage} />
      </Switch>
    </ApplicationLayout>
  </Route>
);
