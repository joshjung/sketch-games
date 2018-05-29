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
        {user ? <span>{user.email}<Button label="Logout" onClick={this.logout_onClickHandler} /></span> :
          <Button label="Login" onClick={this.login_onClickHandler} />}
        <Button label="New User" onClick={this.newUser_onClickHandler} />
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

  newUser_onClickHandler() {
    history.push('/user/create');
  }

  login_onClickHandler() {
    history.push('/login');
  }
}

export default Header;
