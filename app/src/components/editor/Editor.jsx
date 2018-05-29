import React from 'react';

import {RingaComponent, TextInput, I18NModel, Button} from 'ringa-fw-react';
import {dependency, watch} from 'react-ringa';

import GameController from '../../controllers/GameController';
import APIController from '../../controllers/APIController';

import history from '../../global/history';

import './Editor.scss';

import * as monaco from 'monaco-editor';

global.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/json.worker.bundle.js';
    }
    if (label === 'css') {
      return '/css.worker.bundle.js';
    }
    if (label === 'html') {
      return '/html.worker.bundle.js';
    }
    return '/editor.worker.bundle.js';
  }
};

export default class Editor extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {
      editingGameTitle: false
    };

    this.watchProps('game');

    this.depend(
      dependency(I18NModel, 'language'),
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDidMount() {
    super.componentDidMount();
    // monaco.editor.create(document.getElementById('monaco-editor-container'), {
    //   value: [
    //     'function x() {',
    //     '\tconsole.log("Hello world!");',
    //     '}'
    //   ].join('\n'),
    //   language: 'javascript'
    // });
  }

  render() {
    const {editingGameTitle} = this.state;
    const {title, gameLoopFnText, syntaxError, runError} = this.props.game;

    return <div className="editor">
      {editingGameTitle ?
        <TextInput model={this.props.game} modelField="title"
                   focusOnMount={true}
                   onEnterKey={this.title_onEnterKeyHandler} /> :
        <h1 onClick={this.title_onClickHandler}>{title}</h1>}
      <textarea ref="loopFn" change={this.textInput_onChangeHandler}>{gameLoopFnText}</textarea>
      <div id="monaco-editor-container" />
      <Button label="Save" onClick={this.saveJavascript_onClickHandler} />
      <Button label={this.props.game.paused ? 'Resume' : 'Pause' } onClick={this.pausePlay_onClickHandler} />
      <div>{syntaxError ? 'Syntax Error' + syntaxError : undefined}</div>
      <div>{runError ? 'Run Error' + runError : undefined}</div>
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  saveJavascript_onClickHandler(event) {
    this.dispatch(GameController.SET_LOOP_FN, {
      gameLoopFn: this.refs.loopFn.value
    }).then(success => {
      if (success) {
        const {game} = this.props;
        const body = game.serialize();
        if (!game.id) {
          delete body.id;
        }
        this.dispatch(APIController.SAVE_GAME, {body}).then($lastPromiseResult => {
          history.push(`/games/playground/${$lastPromiseResult.id}`);
        });
      }
    });
  }

  title_onClickHandler(event) {
    this.setState({ editingGameTitle: true });
  }

  title_onEnterKeyHandler(event) {
    this.setState({ editingGameTitle: false });
  }

  pausePlay_onClickHandler() {
    this.props.game.paused = !this.props.game.paused;
  }

  code_onChangeHandler(event) {
    console.log('CHANGE', arguments);
  }
}
