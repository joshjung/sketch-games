import React from 'react';

import {Model} from 'ringa';

import {RingaComponent, I18NModel, TextInput, Button} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import APIController from '../../controllers/APIController';

import GameModel from '../../models/GameModel';

import history from '../../global/history';

export default class EditGame extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language')
    );

    this.gameModel = new GameModel();
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    return <div className="editor">
      Title:
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
        title: this.gameModel.title
      }
    }).then(success => {
      if (success) {
        history.replace('/games');
      }
    });
  }
}
