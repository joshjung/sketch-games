import React from 'react';

import {RingaComponent, I18NModel} from 'ringa-fw-react';
import {dependency, attach} from 'react-ringa';

import AppController from '../controllers/AppController';
import AppModel from '../models/AppModel';

import Editor from '../components/editor/Editor';

import './PlaygroundPage.scss';

export default class PlaygroundPage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(
      dependency(I18NModel, 'language'),
      dependency(AppModel, ['curGame', 'token'])
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

    if (!curGame) {
      return <div>Loading...</div>;
    }

    return <div className="playground">
      <Editor game={curGame} />
    </div>;
  }

  refreshGame(id) {
    try {
      this.setState({curGame: undefined});
      if (id) {
        this.dispatch(AppController.GET_GAME_AND_SET_CURRENT, { id, playgroundComponent: this });
      } else {
        console.error('No ID provided to get the game!');
      }
    } catch (error) {
      console.error(error);
    }
  }
}

