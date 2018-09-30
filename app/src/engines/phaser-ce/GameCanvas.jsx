import React from 'react';

import GameCanvasBase from '../shared/GameCanvasBase';

import {calculateCanvasPositionAndSize} from "../shared/core/CanvasSizeUtil";

let Phaser;

import {callGameCode} from '../shared/api/gameLoopCaller';
import './GameCanvas.scss';

export default class PhaserGameCanvas extends GameCanvasBase {
  constructor(props) {
    super(props);
  }

  renderCanvas() {
    return <div id="phaser-wrapper" ref="canvasWrapper">
      <div id="phaser-container" />
    </div>;
  }

  scaleCanvas(scaleManager) {
    const {game} = this.props;

    const containerBounds = this.refs.canvasWrapper.getBoundingClientRect();

    const finalRect = calculateCanvasPositionAndSize({
      gameWidth: game.engineSettings.width,
      gameHeight: game.engineSettings.height,
    }, {
      containerTop: containerBounds.top,
      containerWidth: containerBounds.width,
      containerHeight: containerBounds.height
    }, {
      showControlsIfMobile: true
    });

    scaleManager.setUserScale(finalRect.gameScaleX, finalRect.gameScaleY);
  }

  gameDestroyHandler() {
    if (this.phaserGame) {
      this.phaserGame.destroy();
      this.phaserGame = undefined;
    }
  }

  gameResetHandler() {
    const {game} = this.props;

    if (this.phaserGame) {
      this.phaserGame.destroy();
      this.phaserGame = undefined;
    }

    Phaser = game._libs.Phaser;

    game.exposedPermanentState = {
      Phaser,
      events: {}
    };

    callGameCode({game});

    const self = this;

    const config = {
      preload: function (...args) {
        self.phaserGame.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        self.phaserGame.scale.setResizeCallback(self.scaleCanvas.bind(this));

        args.unshift(self.phaserGame);
        if (game.exposedState && game.exposedPermanentState.events.preload) {
          game.exposedPermanentState.events.preload.apply(this, args);
        }
      },
      create: function (...args) {
        args.unshift(self.phaserGame);
        if (game.exposedState && game.exposedPermanentState.events.create) {
          game.exposedPermanentState.events.create.apply(this, args);
        }
      },
      update: function (...args) {
        args.unshift(self.phaserGame);
        if (game.exposedState && game.exposedPermanentState.events.update) {
          game.exposedPermanentState.events.update.apply(this, args);
        }
      },
      render: function (...args) {
        args.unshift(self.phaserGame);
        if (game.exposedState && game.exposedPermanentState.events.render) {
          game.exposedPermanentState.events.render.apply(this, args);
        }
      }
    };

    this.phaserGame = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-container', config);

    if (game.exposedPermanentState && game.exposedPermanentState.events.reset) {
      game.exposedPermanentState.events.reset(this.phaserGame);
    }
  }

  gameSignalHandler(signal) {
    if (signal === 'reset') {
      this.gameResetHandler();
    }

    if (signal === 'destroy') {
      this.game.unwatch(this.gameSignalHandler);

      this.gameDestroyHandler();
    }
  }

  gameChangeHandler(game) {
    super.gameChangeHandler(game);

    this.gameSignalHandler = this.gameSignalHandler.bind(this);

    game.watch(this.gameSignalHandler);
  }
}
