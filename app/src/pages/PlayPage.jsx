import React from 'react';

import {RingaComponent, Button, Alert, Markdown} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import AppController from '../controllers/AppController';
import AppModel from '../models/AppModel';

import GameTimer from '../components/GameTimer';

import GameCanvas from '../components/game/GameCanvas';

import './PlayPage.scss';

export default class PlaygroundPage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(dependency(AppModel, ['curGame', 'token']));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    try {
      let { id } = this.props.match.params;
      if (id) {
        this.dispatch(AppController.GET_GAME_AND_SET_CURRENT, { id, playgroundComponent: this });
      } else {
        console.error('No ID provided to get the game!');
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const {curGame} = this.state;

    if (!curGame) {
      return <div>Loading...</div>;
    }

    return <div className="play">
      <div className="play-header">
        <h1>{curGame.title}</h1>
        <div>
          <GameTimer game={curGame} />
          <Button label="Restart" onClick={this.restart_onClickHandler} />
          <Button label={curGame.paused ? 'Resume' : 'Pause' } onClick={this.pausePlay_onClickHandler} />
        </div>
      </div>
      <div className="game-instructions-container">
        <GameCanvas game={curGame}/>
        <Markdown markdown={curGame.instructions} classes="instructions" />
      </div>
    </div>;
  }

  pausePlay_onClickHandler() {
    this.state.curGame.paused = !this.state.curGame.paused;

    this.forceUpdate();
  }

  restart_onClickHandler() {
    const wasPaused = this.state.curGame.paused;
    this.state.curGame.paused = true;

    Alert.show('Are you sure you want to reset this game?', Alert.YES_NO, {}, this.rootDomNode).then(result => {
      if (result.id === 'yes') {
        this.state.curGame.reset();
      }

      this.state.curGame.paused = wasPaused;

      this.forceUpdate();
    });
  }
}

