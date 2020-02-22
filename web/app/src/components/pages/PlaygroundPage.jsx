import React from 'react';

import {RingaComponent, I18NModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import GamePenController from '../../controllers/GamePenController';
import GamePenModel from '../../models/GamePenModel';

import Editor from '../editor/Editor';

import Loader from '../Loader';

import './PlaygroundPage.scss';

export default class PlaygroundPage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(GamePenModel, ['curGame', 'token'])
    );
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDispatchReady() {
    this.refreshGame(this.props.match.params.id);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.refreshGame(nextProps.match.params.id);
    }
  }

  render() {
    const {curGame} = this.state;

    return <div className="playground">
      {curGame ? <Editor game={curGame} /> : undefined}
      <Loader show={!curGame}/>
    </div>;
  }

  refreshGame(id) {
    try {
      this.setState({curGame: undefined});
      if (id) {
        this.dispatch(GamePenController.GET_GAME_AND_SET_CURRENT, { id, playgroundComponent: this });
      } else {
        console.error('No ID provided to get the game!');
      }
    } catch (error) {
      console.error(error);
    }
  }
}

