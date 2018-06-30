import React from 'react';
import { Route, Switch } from 'react-router';

import ApplicationLayout from './layout/ApplicationLayout';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import PlaygroundPage from './components/pages/PlaygroundPage';
import PlayPage from './components/pages/PlayPage';
import LoginPage from './components/pages/LoginPage';
import PasswordResetPage from './components/pages/PasswordResetPage';
import PasswordResetValidatePage from './components/pages/PasswordResetValidatePage';
import NewUserPage from './components/pages/NewUserPage';
import NewGamePage from './components/pages/NewGamePage';
import GamesPage from './components/pages/GamesPage';
import APIPage from "./components/pages/APIPage";

export default (
  <Route path="/">
    <ApplicationLayout>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/games/new" exact component={NewGamePage} />
        <Route path="/games/:filter" exact component={GamesPage} />
        <Route path="/games" exact component={GamesPage} />
        <Route path="/games/:userId" exact component={GamesPage} />
        <Route path="/games/playground/:id" exact component={PlaygroundPage} />
        <Route path="/games/play/:id" exact component={PlayPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/user/create" exact component={NewUserPage} />
        <Route path="/about" exact component={AboutPage} />
        <Route path="/api" exact component={APIPage} />
        <Route path="/account/password/reset" exact component={PasswordResetPage} />
        <Route path="/account/password/validate-reset/:token" exact component={PasswordResetValidatePage} />
      </Switch>
    </ApplicationLayout>
  </Route>
);
