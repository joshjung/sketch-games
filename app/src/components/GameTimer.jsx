import React from 'react';

import {RingaComponent} from 'ringa-fw-react';

import './GameTimer.scss';

export default class GameTimer extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    setInterval(() => {
      this.forceUpdate();
    }, 100);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    return <span className="timer">
      Time: {Math.round(this.props.game.timePlayed)}
    </span>;
  }
}
