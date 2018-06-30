import React from 'react';

import {RingaComponent, TextInput, Button} from 'ringa-fw-react';
import {dependency} from 'react-ringa';
import APIController from '../../controllers/APIController';
import GamePenModel from '../../models/GamePenModel';

import GameModel from '../../models/GameModel';

import history from '../../util/history';

import './NewGame.scss';

export default class NewGame extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.gameModel = new GameModel();
    this.depend(dependency(GamePenModel, 'user'));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    return <div className="new-game">
      <h3>Game Title:</h3>
      <div><TextInput model={this.gameModel} modelField="title"/></div>
      <div>
        <Button label="Create Game!" onClick={this.save_onClickHandler} />
      </div>
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  save_onClickHandler() {
    this.dispatch(APIController.SAVE_GAME, {
      body: {
        title: this.gameModel.title,
        ownerUserId: this.state.user.id
      }
    }).then((success, $lastPromiseResult) => {
      console.log($lastPromiseResult);
      if (success) {
        history.replace(`/games/playground/${$lastPromiseResult.game.id}`);
      }
    });
  }
}
