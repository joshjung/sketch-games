import React from 'react';

import {RingaComponent, TextInput, Button, TabNavigator, Tab, Alert, Markdown, I18NModel, Checkbox} from 'ringa-fw-react';
import {dependency} from 'react-ringa';
import GameController from '../../controllers/GameController';
import APIController from '../../controllers/APIController';
import AppModel from '../../models/AppModel';
import history from '../../global/history';
import GameCanvas from '../game/GameCanvas';

import moment from 'moment';

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
      code: '',
      instructions: 'Enter your instructions using Markdown syntax',
      description: '',
      title: ''
    };

    this.depend(dependency(AppModel, ['user']), dependency(I18NModel, 'language'));

    if (this.props.game) {
      this.state.code = this.props.game.gameLoopFnText;
      this.state.instructions = this.props.game.instructions;
      this.state.description = this.props.game.description;
      this.state.title = this.props.game.title;

      this.props.game.watch(signal => {
        if (['syntaxError', 'runError', 'published'].indexOf(signal) !== -1) {
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
    const {title, code, instructions, user, i18NModel} = this.state;
    const {owner, syntaxError, runError, published, ownerUserId, publishedDate, description} = this.props.game;
    const codeLength = code.length;

    return <div className="editor">
      <div className="header">
        <h1>{title}</h1>
        <h3>Author: {owner.name}, {codeLength} bytes {published ? <span className="published-card">Published</span> : <span className="unpublished-card">Unpublished</span> }</h3>
        <div className="actions">
          <Button label={user && this.props.game.ownerUserId === user.id ? 'Save and Reset' : 'Commit Code'} onClick={this.save_onClickHandler} />
          <Button label="Restart Game" onClick={this.reset_onClickHandler} />
          <Button label={this.props.game.paused ? 'Resume' : 'Pause' } onClick={this.pausePlay_onClickHandler} />
          {(user && user.id !== this.props.game.ownerUserId) && <Button label="Duplicate to my account" onClick={this.duplicate_clickHandler} />}
          {published && <Button label="Play Published Game" onClick={this.playPublished_onClickHandler} />}
        </div>
      </div>
      <div className="workspace">
        <div className="left-pane">
          <TabNavigator>
            <Tab label="Code" classes="code">
              {(!user || user.id !== ownerUserId) && <div className="code-note">This code belongs to {owner.name}. You are in playground mode and can change the code as much as you like and press Commit Code to see the changes. Login to duplicate this game to your account!</div>}
              {(user && user.id !== ownerUserId) && <div className="code-note">You can copy this game to your account by clicking Duplicate above.</div>}
              <textarea onChange={this.code_onChangeHandler} value={code} wrap="soft" />
            </Tab>
            <Tab label="Instructions" classes="instructions">
              {user && user.id === ownerUserId ? <TabNavigator>
                <Tab label="Edit">
                  <textarea onChange={this.instructions_onChangeHandler} value={instructions} wrap="soft" />
                </Tab>
                <Tab label="Preview">
                  <Markdown markdown={instructions}/>
                </Tab>
              </TabNavigator> : <Markdown markdown={instructions}/>}
            </Tab>
            <Tab label="Settings" visible={!!(user && (user.id === ownerUserId))}>
              Title: <TextInput defaultValue={title} onChange={this.title_onChangeHandler} />
              Description: <TextInput multiline defaultValue={description} onChange={this.description_onChangeHandler} />
              {published ?
                <h3 className="published">Your game is live! It was published {moment(publishedDate).fromNow()}.</h3> :
                <h3 className="unpublished">Your game is not live.</h3>
              }
              <Button label="Publish Latest Changes" onClick={this.publish_onClickHandler} />
              {published && <Button label="Unpublish" onClick={this.unpublish_onClickHandler} />}
            </Tab>
            <Tab label="API">
              <Markdown markdown={i18NModel.i18n('api')}/>
            </Tab>
          </TabNavigator>
          {syntaxError && <div className="error">Syntax Error: {syntaxError.toString()}</div>}
          {runError && <div className="error">Run Error: {runError.toString()}</div>}
        </div>
        <div className="right-pane">
          <GameCanvas game={this.props.game}/>
        </div>
      </div>
    </div>;
  }

  saveGame() {
    const {game} = this.props;

    if (!game.ownerUserId) {
      game.ownerUserId = this.state.user.id;
    }

    game.instructions = this.state.instructions;
    game.description = this.state.description;

    const body = game.serialize();

    if (!game.id) {
      delete body.id;
    }

    this.dispatch(APIController.SAVE_GAME, {
      body
    }).then($lastPromiseResult => {
      history.push(`/games/playground/${$lastPromiseResult.id}`);

      this.forceUpdate();
    });
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  save_onClickHandler(event) {
    this.dispatch(GameController.SET_LOOP_FN, {
      gameLoopFn: this.state.code
    }).then(success => {
      if (success) {
        this.saveGame();
      }
    });
  }

  pausePlay_onClickHandler() {
    this.props.game.paused = !this.props.game.paused;

    this.forceUpdate();
  }

  reset_onClickHandler() {
    this.props.game.reset();

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

  description_onChangeHandler(event) {
    this.setState({
      description: event.target.value
    });
  }

  title_onChangeHandler(event) {
    this.setState({
      title: event.target.value
    });
  }

  duplicate_clickHandler() {
    const {game} = this.props;

    Alert.show(`Do you want to completely copy ${game.title} into your account?`, Alert.YES_NO, {}, this.rootDomNode).then(result => {
      if (result.id === 'yes') {
        this.dispatch(APIController.CLONE_GAME, {
          id: game.id
        }).then($lastPromiseResult => {
          if ($lastPromiseResult._id) {
            history.push(`/games/playground/${$lastPromiseResult._id}`);
          } else {
            console.error('An error occurred', $lastPromiseResult);
          }
        });
      }
    })
  }

  publish_onClickHandler() {
    const {game} = this.props;

    Alert.show('Are you ready to publish your game? You can still edit your game after publishing and your changes will not go live until you publish again.', Alert.YES_NO, {}, this.rootDomNode).then(result => {
      if (result.id === 'yes') {
        game.publish();

        this.saveGame();
      }
    });
  }

  unpublish_onClickHandler() {
    const {game} = this.props;

    Alert.show('Are you sure you want to remove your game from being live? People can still play it with a direct link, but they will not be able to find it in explore.', Alert.YES_NO, {}, this.rootDomNode).then(result => {
      if (result.id === 'yes') {
        game.unpublish();

        this.saveGame();
      }
    });
  }

  playPublished_onClickHandler() {
    const {game} = this.props;

    history.push(`/games/play/${game.id}`);
  }
}
