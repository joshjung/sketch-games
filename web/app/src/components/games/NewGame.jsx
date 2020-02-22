import React from 'react';

import {RingaComponent, TextInput, Button, Dropdown} from 'ringa-fw-react';
import {dependency} from 'react-ringa';
import APIController from '../../controllers/APIController';
import GamePenModel from '../../models/GamePenModel';

import GameEngineDropdown from '../GameEngineDropdown';

import GameModel from '../../models/GameModel';

import history from '../../util/history';

import './NewGame.scss';

export default class NewGame extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {
      valid: false
    };

    this.gameModel = new GameModel();
    this.depend(dependency(GamePenModel, 'user'));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {valid} = this.state;

    return <div className="new-game">
      <h3>Game Title:</h3>
      <div><TextInput model={this.gameModel} modelField="title"/></div>
      <h3>Game Engine:</h3>
      <div><GameEngineDropdown onChange={this.engine_onChangeHandler}/></div>
      <div>
        <Button label="Create Game!"
                classes="green"
                onClick={this.save_onClickHandler}
                enabled={valid} />
      </div>
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  save_onClickHandler() {
    if (!this.state.valid) {
      return;
    }

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

  engine_onChangeHandler(engine) {
    this.gameModel.engineId = engine.id;

    this.setState({
      valid: true
    });
  }
}
