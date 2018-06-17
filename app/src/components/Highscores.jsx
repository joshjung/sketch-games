import React from 'react';

import {RingaComponent, ModalToggleContainer} from 'ringa-fw-react';

import './Highscores.scss';

import APIController from '../controllers/APIController';

import moment from 'moment';

export default class Highscores extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.state = {selectedHighscore: undefined};
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  render() {
    const {game} = this.props;
    const {selectedHighscore} = this.state;

    return <div className="highscores">
      {!game.sortedHighscores.length && <label>No highscores yet.</label>}
      <div className="highscore header">
        <div className="position"></div>
        <div className="points">Score</div>
        <div className="name">Name</div>
        <div className="time">Game Time</div>
        <div className="timestamp">Date</div>
      </div>
      {game.sortedHighscores.map((hs, ix) => <div key={`hs${ix}`} className="highscore hoverable" onClick={this.viewHighscore_onClickHandler.bind(this, hs)}>
        <div className="position">{ix + 1}.</div>
        <div className="points"> {hs.score}</div>
        <div className="name"> {hs.name}</div>
        <div className="time"> {Math.round(hs.time)} s.</div>
        <div className="timestamp"> {hs.timestamp ? moment(hs.timestamp).fromNow() : 'No date available'}</div>
      </div>)}
      <ModalToggleContainer show={!!selectedHighscore}
                            title={selectedHighscore ? `Highscore ${selectedHighscore.score} by ${selectedHighscore.name}` : 'N/A'}
                            classes="modal-highscore"
                            width={310}
                            height={265}
                            draggable={false}
                            position="centered"
                            blockMouseEvents
                            closeOnMouseDownOutside
                            mouseDownOutsideHandler={this.modal_mouseDownOutsideHandler}
                            showWrapper>
        <img src={selectedHighscore ? selectedHighscore.screenshot : ''}/>
      </ModalToggleContainer>
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  modal_mouseDownOutsideHandler() {
    this.setState({
      selectedHighscore: undefined
    });
  }

  viewHighscore_onClickHandler(hs) {
    this.setState({
      selectedHighscore: undefined
    });
    this.dispatch(APIController.VIEW_HIGHSCORE, {
      id: this.props.game.id,
      userId: hs.userId,
      timestamp: hs.timestamp
    }).then($lastPromiseResult => {
      this.setState({
        selectedHighscore: $lastPromiseResult.highscore
      });
    });
  }
}


