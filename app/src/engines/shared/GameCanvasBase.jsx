import React from 'react';

import {RingaComponent, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';

import Document from './core/Document';
import DocumentEvents from './core/events/DocumentEvents';
import MobileInputController from './core/input/MobileInputController';

import Loader from '../../components/Loader';

import './GameCanvasBase.scss';

export default class GameCanvasBase extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(dependency(ScreenModel, 'curBreakpointIx'));

    this.document = new Document();
    this.document.addListener(DocumentEvents.FOCUS_CHANGE, () => {
      console.log('Focus changed!', this.document.focus);
      if (!this.document.focus) {
        this.pausedBeforeUnfocus = this.props.game.paused;
      } else if (this.document.focus) {
        this.props.game.paused = this.pausedBeforeUnfocus;
      }
    });

    this.gameChangeHandler(props.game);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentWillUpdate(nextProps) {
    if (nextProps.game && nextProps.game.gameContainer && nextProps.game !== this.props.game) {
      this.gameChangeHandler(nextProps.game);
    }

    // Force a resize event to trigger the canvas to place itself properly if needed
    setTimeout(() => {
      this.resizeHandler();
    }, 50);
  }

  renderCanvas() {
    return <canvas ref="canvas" />;
  }

  renderControls() {
    const {curBreakpointIx} = this.state;

    return curBreakpointIx < 3 && <MobileInputController game={this.props.game} />;
  }

  render() {
    const {classes} = this.state;
    const cn = this.calcClassnames('canvas', classes);

    return <div className={cn}>
      {this.renderCanvas()}
      {this.renderControls()}
      {this.props.game.paused && !this.props.game.development && <div className="paused" onClick={this.play_clickHandler}>
        <div className="game-paused">Game Paused</div>
        <div className="click-to-resume">Click to Resume</div>
        <div><i className="fa fa-play" /></div>
      </div> }
      <Loader show={this.props.game.loading}/>
    </div>;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  play_clickHandler() {
    this.props.game.paused = false;

    this.forceUpdate();
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  gameChangeHandler(game) {
    this.game = game;
    // Noop but can be overridden obvs
  }

  resizeHandler() {
    // Noop
  }
}
