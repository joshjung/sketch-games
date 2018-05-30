import React from 'react';

import {RingaComponent, TextInput, Button, TabNavigator, Tab} from 'ringa-fw-react';
import {dependency} from 'react-ringa';
import GameController from '../../controllers/GameController';
import APIController from '../../controllers/APIController';
import AppModel from '../../models/AppModel';
import history from '../../global/history';

import './Editor.scss';

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
      editingGameTitle: false,
      code: '',
      instructions: 'Enter your instructions using Markdown syntax'
    };

    this.depend(dependency(AppModel, ['user']));

    if (this.props.game) {
      this.state.code = this.props.game.gameLoopFnText;
      this.state.instructions = this.props.game.instructions;
      this.props.game.watch(signal => {
        if (signal === 'syntaxError' || signal === 'runError') {
          //console.error('ERROR', this.props.game.syntaxError, this.props.game.runError);
          this.forceUpdate();
        }
      })
    }
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentWillUpdate(nextProps) {
    if (nextProps.game !== this.props.game) {
      this.setState({
        code: nextProps.game ? nextProps.game.gameLoopFnText : '',
        instructions: nextProps.game ? nextProps.game.instructions : ''
      });
    }
  }

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
    const {editingGameTitle, code, instructions} = this.state;
    const {title, syntaxError, runError} = this.props.game;
    const codeLength = code.length;
    return <div className="editor">
      {editingGameTitle ?
        <TextInput model={this.props.game} modelField="title"
                   focusOnMount={true}
                   onEnterKey={this.title_onEnterKeyHandler} /> :
        <h1 onClick={this.title_onClickHandler}>{title} ({codeLength} bytes)</h1>}
      <TabNavigator>
        <Tab label="Code">
          <textarea onChange={this.code_onChangeHandler} value={code} wrap="soft" />
        </Tab>
        <Tab label="Instructions">
          <textarea onChange={this.instructions_onChangeHandler} value={instructions} wrap="soft" />
        </Tab>
      </TabNavigator>
      <div className="error">{syntaxError ? 'Syntax Error: ' + syntaxError : undefined}</div>
      <div className="error">{runError ? 'Run Error: ' + runError : undefined}</div>
      <Button label="Save" onClick={this.saveJavascript_onClickHandler} />
      <Button label={this.props.game.paused ? 'Resume' : 'Pause' } onClick={this.pausePlay_onClickHandler} />
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  saveJavascript_onClickHandler(event) {
    this.dispatch(GameController.SET_LOOP_FN, {
      gameLoopFn: this.state.code
    }).then(success => {
      if (success) {
        const {game} = this.props;

        if (!game.ownerUserId) {
          game.ownerUserId = this.state.user.id;
        }

        game.instructions = this.state.instructions;

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

    this.forceUpdate();
  }

  code_onChangeHandler(event) {
    this.setState({
      code: event.target.value
    });
  }

  instructions_onChangeHandler(event) {
    this.setState({
      instructions: event.target.value
    });
  }
}
