import React from 'react';
import {RingaComponent, I18NModel, I18NSwitcher, ScreenModel, Button} from 'ringa-fw-react';
import {depend, dependency} from 'react-ringa';

import AppModel from '../models/AppModel';
import APIController from '../controllers/APIController';

import history from '../global/history';

import './Header.scss';

class Header extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    depend(this, [
      dependency(I18NModel, 'language'),
      dependency(ScreenModel, 'curBreakpointIx'),
      dependency(AppModel, ['token', 'user'])
    ]);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render(props) {
    const {i18NModel, curBreakpointIx, user} = this.state;

    return <header className="app-header">
      <div className="title">
        <a onClick={this.home_onClickHandler}>
          {i18NModel.i18n(curBreakpointIx < 1 ? 'header.shortTitle' : 'header.title')}
        </a>
      </div>
      <div>
        <Button label="Home" onClick={this.home_onClickHandler} />
        <Button label="Explore" onClick={this.games_onClickHandler} />
        <Button label="About" onClick={this.about_onClickHandler} />
        <Button label="API" onClick={this.api_onClickHandler} />
      </div>
      <div>
        {user ? <div>
            <span className="username">{user.name}</span>
            <Button label="My Games" onClick={this.myGames_onClickHandler} />
            <Button label="Create Game" onClick={this.newGame_onClickHandler} />
            <Button label="Logout" onClick={this.logout_onClickHandler} />
          </div> :
          <Button label="Login" onClick={this.login_onClickHandler} />}
        {!user && <Button label="Register" onClick={this.newUser_onClickHandler} />}
      </div>
    </header>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  home_onClickHandler() {
    history.push('/');
  }

  logout_onClickHandler() {
    this.dispatch(APIController.LOGOUT).then(() => {
      history.push('/login');
    });
  }

  myGames_onClickHandler() {
    history.push('/games/mine');
  }

  home_onClickHandler() {
    history.push('/');
  }

  newUser_onClickHandler() {
    history.push('/user/create');
  }

  login_onClickHandler() {
    history.push('/login');
  }

  games_onClickHandler() {
    history.push('/games');
  }

  newGame_onClickHandler() {
    history.push('/games/new');
  }

  about_onClickHandler() {
    history.push('/about');
  }

  api_onClickHandler() {
    history.push('/api');
  }
}

export default Header;
