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
      dependency(AppModel, ['token', 'user', 'fullscreen']),
      dependency(ScreenModel, 'curBreakpointIx')
    ]);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render(props) {
    const {i18NModel, curBreakpointIx, user, fullscreen} = this.state;

    if (fullscreen) {
      return <div className="app-header-fullscreen">
        <button>Exit Fullscreen</button>
      </div>;
    }

    return <header className="app-header">

      <div className="logo">
        <a onClick={this.home_onClickHandler}>
          <i className="fa fa-play-circle"></i>
          {curBreakpointIx >= 2 && <div className="title">

              {i18NModel.i18n('header.title')}

            {curBreakpointIx > 2 && <div className="tagline">{i18NModel.i18n('header.tagline')}</div>}
          </div>}
        </a>
      </div>
      {curBreakpointIx > 2 && <div>
        <Button label="Games" onClick={this.home_onClickHandler} />
        {curBreakpointIx >= 4 && <Button label="Explore" onClick={this.games_onClickHandler} />}
        <Button label="About" onClick={this.about_onClickHandler} />
        {curBreakpointIx >= 4 && <Button label="API" onClick={this.api_onClickHandler} />}
      </div>}
      <div>
        {user ? <div>
            <span className="username">{user.name}</span>
            {curBreakpointIx >= 3 && <Button label="My Games" onClick={this.myGames_onClickHandler} />}
            {curBreakpointIx >= 4 && <Button label="Create Game" onClick={this.newGame_onClickHandler} />}
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
