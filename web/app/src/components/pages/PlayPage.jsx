import React from 'react';

import {RingaComponent, Button, Markdown, TabNavigator, Tab, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import GamePenController from '../../controllers/GamePenController';
import GamePenModel from '../../models/GamePenModel';

import Highscores from '../Highscores';
import Loader from '../Loader';

import history from '../../util/history';

import moment from 'moment';

import './PlayPage.scss';

export default class PlayPage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {
      selectedIx: 0,
      ignoreLoginWarning: false,
      largeScreen: false
    };

    // TODO figure out a better way to keep the buttons from being focused
    document.addEventListener('click', function(e) {
      if(document.activeElement.toString() === '[object HTMLButtonElement]') {
        const tabindex = document.activeElement.getAttribute('tabindex');

        if (parseInt(tabindex) === -1) {
          document.activeElement.blur();
        }
      }
    });

    this.depend(dependency(GamePenModel, ['curGame', 'token', 'user']), dependency(ScreenModel, 'curBreakpointIx'));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    try {
      let { id } = this.props.match.params;
      if (id) {
        this.dispatch(GamePenController.GET_GAME_AND_SET_CURRENT, { id, playgroundComponent: this, mode: 'published' }).then(() => {
          const {curGame} = this.state.gamePenModel;

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
    const {curGame, user, curBreakpointIx, selectedIx, ignoreLoginWarning, largeScreen} = this.state;

    if (!curGame) {
      return <div className="play-mobile page">
        <Loader key="loader" show />
      </div>;
    }

    const {EngineCanvasComponent} = curGame.engine;
    const gc = <EngineCanvasComponent id="primary-game-canvas"
                                      classes={largeScreen ? 'large-screen' : ''}
                                      game={curGame}/>;

    if (curBreakpointIx < 3) {
      return <div className="play-mobile page">
        <div className="play-header">
          {!user && !ignoreLoginWarning && <div className="sub-header warning">You are not logged in! No highscores will be recorded.
            <Button label="Ignore" onClick={this.ignoreLoginWarning_onClickHandler} focusable="false" tabIndex={-1} />
          </div>}
          {(user || ignoreLoginWarning) && <div className="sub-header">
            <h1>
              {curGame.activeTitle} {!curGame.published && <span className="beta-card">Beta</span>}
            </h1>
            <div>
              <Button onClick={this.restart_onClickHandler} focusable="false" tabIndex={-1}>
                <i className="fa fa-step-backward" /> Reset
              </Button>
              <Button onClick={this.pausePlay_onClickHandler} focusable="false" tabIndex={-1}>
                {curGame.paused ? <i className="fa fa-play" /> : <i className="fa fa-pause" />}
                {curGame.paused ? ' Resume' : ' Pause'}
              </Button>
            </div>
          </div>}
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
        <Loader key="loader" />
      </div>;
    } else {
      return <div className="play page">
        <div className="play-header">
          <h1>{curGame.activeTitle} {!curGame.published && <span className="beta-card">Beta</span>}</h1>
          <div>
            <Button onClick={this.restart_onClickHandler} focusable="false" tabIndex={-1}>
              <i className="fa fa-step-backward" /> Reset
            </Button>
            <Button onClick={this.pausePlay_onClickHandler} focusable="false" tabIndex={-1}>
              {curGame.paused ? [<i className="fa fa-play" />, ' Resume'] : [<i className="fa fa-pause"/>, ' Pause']}
            </Button>
            {user ? <Button onClick={this.develop_onClickHandler} focusable="false" tabIndex={-1}><i className="fa fa-edit" /> Edit</Button> : undefined}
            <Button onClick={this.toggleLargeScreen_onClickHandler} focusable="false" tabIndex={-1} selected={largeScreen}>
              <i className={largeScreen ? 'fa fa-window-restore' : 'fa fa-window-maximize'} />
              {largeScreen ? ' View All' : ' Theatre Mode'}
            </Button>
          </div>
        </div>
        <div className="game-container">
          {gc}
          {!largeScreen && <div className="details">
            <TabNavigator>
              <Tab label="Highscores">
                {!user && <div className="warning">
                  You are not logged in! No highscores will not recorded.
                  <Button label="Login" onClick={this.login_onClickHandler} focusable="false" tabIndex={-1} />
                </div>}
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
          </div>}
        </div>
        <Loader key="loader" zIndex={20000} />
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

  login_onClickHandler() {
    history.push('/login');
  }

  ignoreLoginWarning_onClickHandler() {
    this.setState({
      ignoreLoginWarning: true
    });
  }

  toggleLargeScreen_onClickHandler() {
    this.setState({
      largeScreen: !this.state.largeScreen
    });
  }
}

