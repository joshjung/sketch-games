import React from 'react';

import {RingaComponent, Markdown, I18NModel} from 'ringa-fw-react';
import {dependency, watch} from 'react-ringa';

import GameController from '../../controllers/GameController';
import APIController from '../../controllers/APIController';

import './Editor.scss';

export default class Editor extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.watchProps('game');

    this.depend(
      dependency(I18NModel, 'language'),
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {title, gameLoopFnText, syntaxError, runError} = this.props.game;

    return <div className="editor">
      <h1>{title} Editor</h1>
      <textarea ref="loopFn">{gameLoopFnText}</textarea>
      <button onClick={this.saveJavascript_onClickHandler}>Save</button>
      <div>{syntaxError ? 'Syntax Error' + syntaxError : undefined}</div>
      <div>{runError ? 'Run Error' + runError : undefined}</div>
    </div>;
  }

  saveJavascript_onClickHandler(event) {
    this.dispatch(GameController.SET_LOOP_FN, {
      gameLoopFn: this.refs.loopFn.value
    }).then(success => {
      if (success) {
        this.dispatch(APIController.SAVE_GAME, {
          body: this.props.game.serialize()
        });
      }
    });
  }
}
