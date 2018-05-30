import React from 'react';

import {RingaComponent} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import AppController from '../controllers/AppController';
import AppModel from '../models/AppModel';

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
      <h1>{curGame.title}</h1>
      <GameCanvas game={curGame}/>
    </div>;
  }
}

