import React from 'react';

import {RingaComponent, Button, Markdown, TabNavigator, Tab} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import AppController from '../controllers/AppController';
import AppModel from '../models/AppModel';

import GameTimer from '../components/GameTimer';

import GameCanvas from '../components/game/GameCanvas';

import Highscores from '../components/Highscores';
import history from '../global/history';

import moment from 'moment';

import './PlayPage.scss';

export default class PlayPage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(dependency(AppModel, ['curGame', 'token', 'user']));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    try {
      let { id } = this.props.match.params;
      if (id) {
        this.dispatch(AppController.GET_GAME_AND_SET_CURRENT, { id, playgroundComponent: this, mode: 'published' }).then(() => {
          const {curGame} = this.state.appModel;

          curGame.watch(signal => {
            if (['highscores'].indexOf(signal) !== -1) {
              this.forceUpdate();
            }
          })
        });
      } else {
        console.error('No ID provided to get the game!');
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const {curGame, user} = this.state;

    if (!curGame) {
      return <div>Loading...</div>;
    }

    return <div className="play">
      <div className="play-header">
        <h1>{curGame.activeTitle} {!curGame.published && <span className="beta-card">Beta</span>}</h1>
        <h3>By {curGame.owner.name}</h3>
        {curGame.published && <h3>Published: {moment(curGame.publishedDate).format('MMMM Do YYYY')}</h3>}
        <div>
          <GameTimer game={curGame} />
          <Button label="Restart" onClick={this.restart_onClickHandler} />
          <Button label={curGame.paused ? 'Resume' : 'Pause' } onClick={this.pausePlay_onClickHandler} />
          {user ? <Button label="Develop" onClick={this.develop_onClickHandler} /> : undefined}
        </div>
      </div>
      <div className="description">{curGame.activeDescription}</div>
      <div className="game-container">
        <GameCanvas game={curGame}/>
        <div className="instructions">
          <TabNavigator>
            <Tab label="Highscores">
              <Highscores game={curGame} />
            </Tab>
            <Tab label="Instructions">
              <Markdown markdown={curGame.activeInstructions} classes="instructions" />
            </Tab>
          </TabNavigator>
        </div>
      </div>
    </div>;
  }

  pausePlay_onClickHandler() {
    this.state.curGame.paused = !this.state.curGame.paused;

    this.forceUpdate();
  }

  develop_onClickHandler() {
    history.push(`/games/playground/${this.state.curGame.id}`);
  }

  restart_onClickHandler() {
    this.state.curGame.reset();

    this.forceUpdate();
  }
}

