import React from 'react';

import GraphicRenderer from './core/GraphicRenderer';

import APIController from '../../controllers/APIController';

import {calculateCanvasPositionAndSize} from "../shared/core/CanvasSizeUtil";

import GameCanvasBase from '../shared/GameCanvasBase';

class JungleGameCanvasRenderer extends GraphicRenderer {
  constructor(gameCanvasComponent, game, canvas, options) {
    super(canvas, options);

    this.gameCanvasComponent = gameCanvasComponent;
    this.game = game;
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

    const {canvas} = this;

    const container = this.canvas.parentNode;

    if (container) {
      const containerBounds = container.getBoundingClientRect();

      if (containerBounds.width !== 0 || containerBounds.height !== 0) {
        const finalRect = calculateCanvasPositionAndSize({
          gameWidth: this.game.engineSettings.width,
          gameHeight: this.game.engineSettings.height,
        }, {
          containerTop: containerBounds.top,
          containerWidth: containerBounds.width,
          containerHeight: containerBounds.height
        }, {
          showControlsIfMobile: true
        });

        canvas.style.width = `${finalRect.width}px`;
        canvas.style.height = `${finalRect.height}px`;
      }
    }
  }
}

export default class JungleGameCanvas extends GameCanvasBase {
  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentDidMount() {
    super.componentDidMount();

    if (!this.props.game.renderer) {
      this.renderer = new JungleGameCanvasRenderer(this, this.props.game, this.refs.canvas, {
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

  resizeHandler() {
    const {game} = this.props;

    if (game.renderer) {
      game.renderer.resizeHandler();
    }
  }
}
