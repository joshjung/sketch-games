import React from 'react';

import {RingaComponent, I18NModel, List, Button} from 'ringa-fw-react';
import {dependency, attach} from 'react-ringa';

import AppModel from '../models/AppModel';
import APIController from '../controllers/APIController';

import history from '../global/history';

export default class GamesPage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(AppModel, 'games')
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    console.log('props', this.props);
    this.dispatch(APIController.GET_GAMES);
  }

  render() {
    const { games = [] } = this.state;

    return <div className="games">
      <Button label="New Game" onClick={this.newGame_onClickHandler} />
      <List items={games} labelField="title" onChange={this.list_onChangeHandler} />
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  newGame_onClickHandler() {
    history.push('/games/new');
  }

  list_onChangeHandler(item) {
    history.push(`/games/playground/${item.id}`);
  }
}
