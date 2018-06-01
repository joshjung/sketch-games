import React from 'react';

import {RingaComponent, Button, Markdown, TabNavigator, Tab, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import AppController from '../controllers/AppController';
import AppModel from '../models/AppModel';

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

    this.state = {
      selectedIx: 0
    };

    this.depend(dependency(AppModel, ['curGame', 'token', 'user']), dependency(ScreenModel, 'curBreakpointIx'));
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
            if (['highscores', 'paused'].indexOf(signal) !== -1) {
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
    const {curGame, user, curBreakpointIx, selectedIx} = this.state;

    if (!curGame) {
      return <div>Loading...</div>;
    }

    const gc = <GameCanvas id="primary-game-canvas" game={curGame}/>;

    if (curBreakpointIx < 3) {
      return <div className="play-mobile page">
        <div className="play-header">
          <div className="sub-header">
            <h1>
              {curGame.activeTitle} {!curGame.published && <span className="beta-card">Beta</span>}
            </h1>
            <div>
              <Button onClick={this.restart_onClickHandler}>
                <i class="fa fa-stop" />
              </Button>
              <Button onClick={this.pausePlay_onClickHandler}>
                {curGame.paused ? <i class="fa fa-play" /> : <i class="fa fa-pause" />}
              </Button>
            </div>
          </div>
        </div>
        <TabNavigator onChange={this.tabNavigator_onChangeHandler} selectedIx={selectedIx}>
          <Tab label="Play" classes="play">
            {gc}
          </Tab>
          <Tab label="Highscores">
            <Highscores game={curGame}/>
          </Tab>
          <Tab label="Instructions">
            <Markdown markdown={curGame.activeInstructions} classes="instructions"/>
          </Tab>
          <Tab label="About" classes="about">
            <div className="description">{curGame.activeDescription}</div>
            <div className="author">By {curGame.owner.name}</div>
            {curGame.published && <div className="published-date">Published: {moment(curGame.publishedDate).format('MMMM Do YYYY')}</div>}
          </Tab>
        </TabNavigator>
      </div>;
    } else {
      return <div className="play page">
        <div className="play-header">
          <h1>{curGame.activeTitle} {!curGame.published && <span className="beta-card">Beta</span>}</h1>
          <div>
            <Button onClick={this.restart_onClickHandler}>
              <i class="fa fa-stop" />
            </Button>
            <Button onClick={this.pausePlay_onClickHandler}>
              {curGame.paused ? <i class="fa fa-play" /> : <i class="fa fa-pause" />}
            </Button>
            {user ? <Button label="Develop" onClick={this.develop_onClickHandler}/> : undefined}
          </div>
        </div>
        <div className="game-container">
          {gc}
          <div className="details">
            <TabNavigator>
              <Tab label="Highscores">
                <Highscores game={curGame}/>
              </Tab>
              <Tab label="Instructions">
                <Markdown markdown={curGame.activeInstructions} classes="instructions"/>
              </Tab>
              <Tab label="About">
                <div className="description">{curGame.activeDescription}</div>
                <div className="author">By {curGame.owner.name}</div>
                {curGame.published && <div className="published-date">Published: {moment(curGame.publishedDate).format('MMMM Do YYYY')}</div>}
              </Tab>
            </TabNavigator>
          </div>
        </div>
      </div>;
    }
  }

  pausePlay_onClickHandler() {
    this.state.curGame.paused = !this.state.curGame.paused;

    if (!this.state.curGame.paused) {
      this.setState({
        selectedIx: 0
      });
    } else {
      this.forceUpdate();
    }
  }

  develop_onClickHandler() {
    history.push(`/games/playground/${this.state.curGame.id}`);
  }

  restart_onClickHandler() {
    this.state.curGame.reset();

    this.forceUpdate();
  }

  tabNavigator_onChangeHandler(ix) {
    this.state.curGame.paused = true;

    this.setState({
      selectedIx: ix
    });
  }
}

