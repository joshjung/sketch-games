import React from 'react';

import {RingaComponent, Markdown, I18NModel, Button} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import AppModel from '../models/AppModel';

import history from '../global/history';

export default class HomePage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(AppModel, 'token')
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {i18NModel, token} = this.state;
    let loginMenu;

    if (token) {
      loginMenu = <div>
        <Button label="All Games" onClick={this.allGames_onClickHandler} />
        <Button label="New Game" onClick={this.newGame_onClickHandler} />
      </div>;
    }

    return <div>
      <Markdown markdown={i18NModel.i18n('home.content')} />
      <Button label="Login" onClick={this.login_onClickHandler} />
      {loginMenu}
    </div>;
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  allGames_onClickHandler() {
    history.replace('/games');
  }

  newGame_onClickHandler() {
    history.replace('/games/new');
  }

  login_onClickHandler() {
    history.replace('/login');
  }
}
