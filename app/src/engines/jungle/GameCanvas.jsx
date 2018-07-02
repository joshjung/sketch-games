import React from 'react';

import GraphicRenderer from './core/GraphicRenderer';

import APIController from '../../controllers/APIController';

import GameCanvasBase from '../shared/GameCanvasBase';

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

export default class GameCanvas extends GameCanvasBase {
  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDidMount() {
    super.componentDidMount();

    if (!this.props.game.renderer) {
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
      } else {
        this.props.game.watch(signal => {
          if (signal === 'gameContainer') {
            this.addGameContainer(this.props.game.gameContainer);
          }
        });
      }

      this.props.game.watch(signal => {
        if (signal === 'loadingItems') {
          this.forceUpdate();
        }
      });
    } else {
      this.renderer = this.props.game.renderer;

      this.renderer.gameCanvasComponent = this;

      this.props.game.renderer.setupCanvas(this.refs.canvas);
      this.props.game.gameCanvas = this;
    }
  }

  componentWillUpdate(nextProps) {
    super.componentWillUpdate(nextProps);

    // Force a resize event to trigger the canvas to place itself properly if needed
    setTimeout(() => {
      nextProps.game.renderer.resizeHandler();
    }, 50);
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

  //-----------------------------------
  // Events
  //-----------------------------------
  gameChangeHandler(game) {
    this.addGameContainer(game.gameContainer);
  }
}
