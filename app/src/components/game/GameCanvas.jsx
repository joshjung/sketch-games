import React from 'react';

import {RingaComponent} from 'ringa-fw-react';

import GraphicRenderer from '../../core/GraphicRenderer';

import APIController from '../../controllers/APIController';

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
      console.log('Recording play!');
      this.gameCanvasComponent.dispatch(APIController.RECORD_PLAY, {
        id: this.game.id
      });

      this.game.playRecorded = true;
    }
  }

  resizeHandler() {
    super.resizeHandler();

    const canvasScreenWidth = this.canvas.clientWidth;
    const canvasPixelWidth = this.canvas.width;
    const canvasPixelHeight = this.canvas.height;
    const widthHeightRatio = canvasPixelHeight / canvasPixelWidth;
    const targetCanvasScreenHeight = canvasScreenWidth * widthHeightRatio;

    this.canvas.style.height = `${targetCanvasScreenHeight}px`;
  }
}

export default class GameCanvas extends RingaComponent {
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
  }

  componentWillUpdate(nextProps) {
    if (nextProps.game && nextProps.game.gameContainer) {
      this.addGameContainer(nextProps.game.gameContainer);
    }
  }

  render() {
    return <div className="canvas">
      <canvas ref="canvas" />
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
}
