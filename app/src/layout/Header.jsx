import React from 'react';
import {RingaComponent, I18NModel, I18NSwitcher, ScreenModel, Button} from 'ringa-fw-react';
import {depend, dependency} from 'react-ringa';

import AppModel from '../models/AppModel';

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
        <span>
          {i18NModel.i18n(curBreakpointIx < 1 ? 'header.shortTitle' : 'header.title')}
        </span>
      </div>
      {user ? user.email : 'Not Logged In'}
      <Button label="Home" onClick={this.home_onClickHandler} />
      <I18NSwitcher />
    </header>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  home_onClickHandler() {
    history.replace('/');
  }
}

export default Header;
