import React from 'react';

import {RingaComponent} from 'ringa-fw-react';

import './GameTimer.scss';

export default class GameTimer extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDidMount() {
    super.componentDidMount();

    this.interval = setInterval(this.update, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <span className="timer">
      Time: {Math.round(this.props.game.timePlayed)}
    </span>;
  }

  update() {
    this.forceUpdate();
  }
}
