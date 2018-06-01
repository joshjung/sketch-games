import React from 'react';

import {RingaComponent} from 'ringa-fw-react';

import './Highscores.scss';

import moment from 'moment';

export default class Highscores extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {game} = this.props;

    return <div className="highscores">
      {!game.sortedHighscores.length && <div>No highscores yet.</div>}
      {game.sortedHighscores.map((hs, ix) => <div key={`hs${ix}`} className="highscore">
        <div className="position"> {ix + 1}.</div>
        <div className="name"> {hs.name}</div>
        <div className="points"> {hs.score} points</div>
        <div className="time"> {Math.round(hs.time)} seconds.</div>
        <div className="timestamp"> {hs.timestamp ? moment(hs.timestamp).fromNow() : 'No date available'}</div>
      </div>)}
    </div>;
  }
}


