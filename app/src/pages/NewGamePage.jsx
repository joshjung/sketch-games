import React from 'react';

import {RingaComponent, I18NModel} from 'ringa-fw-react';
import {dependency, attach} from 'react-ringa';

import NewGame from '../components/games/NewGame';

import './NewGamePage.scss';

export default class NewGamePage extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(dependency(I18NModel, 'language'));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    return <div className="new-game-page page">
      <h1>Create a New Game</h1>
      <div>Creating a game in GamePen Game is easy.</div>
      <div>To start, enter a game title and you will be taken to the editor.</div>
      <NewGame />
    </div>;
  }
}
