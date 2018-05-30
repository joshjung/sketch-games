import React from 'react';

import {RingaComponent, TextInput, Button} from 'ringa-fw-react';
import {dependency} from 'react-ringa';
import APIController from '../../controllers/APIController';
import AppModel from '../../models/AppModel';

import GameModel from '../../models/GameModel';

import history from '../../global/history';

export default class EditGame extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.gameModel = new GameModel();
    this.depend(dependency(AppModel, 'user'));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    return <div className="editor">
      Game Title:
      <TextInput model={this.gameModel} modelField="title"/>
      <Button label="Save" onClick={this.save_onClickHandler} />
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
