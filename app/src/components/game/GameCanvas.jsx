import React from 'react';

import {RingaComponent, ScreenModel} from 'ringa-fw-react';
import {dependency} from 'react-ringa';
import GraphicRenderer from '../../core/GraphicRenderer';

import APIController from '../../controllers/APIController';

import MobileInputController from '../../input/MobileInputController';

import './GameCanvas.scss';

class GameCanvasRenderer extends GraphicRenderer {
  constructor(gameCanvasComponent, game, canvas, options) {
    super(canvas, options);

    this.game = game;
    this.gameCanvasComponent = gameCanvasComponent;
  }

  _onFrameHandler(timestamp) {
    super._onFrameHandler(timestamp);

    if (!this.game.paused) {
      this.game.timePlayed += this.elapsed;
    }

    if (!this.game.playRecorded && this.game.mode === 'published' && this.game.timePlayed > 5) {
      this.gameCanvasComponent.dispatch(APIController.RECORD_PLAY, {
        id: this.game.id
      });

      this.game.playRecorded = true;
    }
  }

  resizeHandler() {
    super.resizeHandler();

    // On mobile, force the canvas width to be such that there is always room for the controls.
    // TODO: this should only happen if the game needs button controls!
    const {canvas} = this;

    const ww = window.innerWidth;
    const wh = window.innerHeight;

    // Reset the width / height to whatever CSS says is correct
    canvas.style.width = '';
    this.setCanvasHeight();

    // VERTICAL MOBILE
    if (ww < wh && ww < 768) {
      const maxHeightOfCanvas = wh - 320; // Leave room for the controls
      const calcHeightOfCanvas = ww * (canvas.height / canvas.width);

      if (calcHeightOfCanvas > maxHeightOfCanvas) {
        const targetWidthOfCanvas = maxHeightOfCanvas * (canvas.width / canvas.height);

        canvas.style.width = `${targetWidthOfCanvas}px`;
      }
    } else {
      // DESKTOP
      const rect = canvas.getBoundingClientRect();
      const {top, height} = rect;
      const mhoc = wh - top - 40; // Give 50 pixels of padding for bottom of screen

      if (height > mhoc) {
        const targetWidthOfCanvas = mhoc * (canvas.width / canvas.height);

        canvas.style.width = `${targetWidthOfCanvas}px`;
      }
    }

    this.setCanvasHeight();
  }

  setCanvasHeight() {
    const {canvas} = this;
    const canvasScreenWidth = canvas.clientWidth;
    const canvasPixelWidth = canvas.width;
    const canvasPixelHeight = canvas.height;
    const widthHeightRatio = canvasPixelHeight / canvasPixelWidth;
    const targetCanvasScreenHeight = canvasScreenWidth * widthHeightRatio;

    canvas.style.height = `${targetCanvasScreenHeight}px`;
  }
}

export default class GameCanvas extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.depend(dependency(ScreenModel, 'curBreakpointIx'));
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDidMount() {
    super.componentDidMount();

    if (!this.props.game.renderer) {
      this.props.game.reset();

      this.renderer = new GameCanvasRenderer(this, this.props.game, this.refs.canvas, {
        debug: false,
        canvasAutoClear: true,
        resetPixelSizeToCanvas: false,
        heightToWidthRatio: 600 / 800
      });

      this.props.game.renderer = this.renderer;
      this.props.game.gameCanvas = this;

      if (this.props.game && this.props.game.gameContainer) {
        this.addGameContainer(this.props.game.gameContainer);
      }
    } else {
      this.renderer = this.props.game.renderer;

      this.renderer.gameCanvasComponent = this;

      this.props.game.renderer.setupCanvas(this.refs.canvas);
      this.props.game.gameCanvas = this;
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.game && nextProps.game.gameContainer && nextProps.game !== this.props.game) {
      this.addGameContainer(nextProps.game.gameContainer);
    }

    // Force a resize event to trigger the canvas to place itself properly if needed
    setTimeout(() => {
      nextProps.game.renderer.resizeHandler();
    }, 50);
  }

  render() {
    const {curBreakpointIx, classes} = this.state;
    const cn = this.calcClassnames('canvas', classes);

    return <div className={cn}>
      <canvas ref="canvas" />
      {curBreakpointIx < 3 && <MobileInputController game={this.props.game} />}
      {this.props.game.paused && !this.props.game.development && <div className="paused" onClick={this.play_clickHandler}>
        <div className="game-paused">Game Paused</div>
        <div className="click-to-resume">Click to Resume</div>
        <div><i className="fa fa-pause" /></div>
      </div> }
    </div>;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  addGameContainer(gameContainer) {
    if (gameContainer === this.curGameContainer) {
      return;
    }

    if (this.curGameContainer) {
      this.renderer.removeChild(this.curGameContainer);
    }

    this.renderer.addChild(gameContainer);

    this.curGameContainer = gameContainer;
  }

  play_clickHandler() {
    this.props.game.paused = false;

    this.forceUpdate();
  }
}
