import GraphicContainer from './core/GraphicContainer';

import Keyboard from './input/Keyboard';
import Mouse from './input/Mouse';

import APIController from '../../controllers/APIController';

import * as RenderAPI from './api/R';
import * as MathAPI from '../shared/api/M';

export default class GameContainer extends GraphicContainer {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(game, options, id) {
    super(options, id);

    this.game = game;

    this.keyboard = new Keyboard(this.game);

    this.game.keyboard = this.keyboard;

    this.game.watch(signal => {
      if (signal === 'reset') {
        this.keyboard = new Keyboard(this.game); // We have to reset the keys
        this.game.keyboard = this.keyboard;
      }
    })
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  recordScore(score) {
    const isHighscore = !this.game.highscores ||
      this.game.highscores.length < 50 ||
      this.game.highscores.find(hs => hs.score < score);

    if (isHighscore) {
      if (this.game.mode === 'published') {
        setTimeout(() => {
          this.game.gameCanvas.dispatch(APIController.RECORD_HIGHSCORE, {
            id: this.game.id,
            score,
            time: this.game.timePlayed
          }).then($lastPromiseResult => {
            if ($lastPromiseResult.success) {
              this.game.highscores = $lastPromiseResult.highscores;
              console.log('new highscores', this.game.highscores);
            }
          });
        }, 0);
      } else {
        console.log(`You are in development mode, your highscore of ${score} is not recorded.`);
      }

      return true;
    }

    return false;
  }

  restart() {
    this.game.restart();
  }

  getAsset(assetId) {
    return this.game.assets.find(a => a.assetId === assetId);
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  onFrameHandler(elapsed) {
    if (!this.mouse) {
      this.mouse = new Mouse(this.renderer.canvas);
    }

    const E = elapsed;

    const R = {
      text: RenderAPI.text.bind(this, this.renderer.ctx),
      poly: RenderAPI.poly.bind(this, this.renderer.ctx),
      circle: RenderAPI.circle.bind(this, this.renderer.ctx),
      bg: RenderAPI.background.bind(this, this.renderer.ctx),
      rect: RenderAPI.rect.bind(this, this.renderer.ctx),
      drawImage: RenderAPI.drawImage.bind(this, this.renderer.ctx, this.game)
    };

    const C = this.renderer.ctx;

    const G = Object.assign(this.game.exposedState, {
      restart: this.restart.bind(this),
      recordScore: this.recordScore.bind(this),
      paused: this.game.paused
    });

    const I = Object.assign({
      keyDown: this.keyboard.keyDown,
      keyCodes: this.keyboard.keyCodes,
      mouseX: this.mouse.mouseX,
      mouseY: this.mouse.mouseY,
      keyActionNames: this.keyboard.keyActionNames,
      keyColors: this.keyboard.keyColors
    }, this.keyboard.keyCodes);

    const T = {
      elapsed,
      now: new Date().getTime(),
      total: this.game.timePlayed
    };

    const M = {
      seed: MathAPI.seed.bind(this),
      rand: MathAPI.rand.bind(this)
    };

    const S = {};

    const L = this.game._libs;

    const A = {
      getAsset: this.getAsset.bind(this)
    };

    const args = [E, R, C, G, I, T, M, S, L, A];

    if (this.game.paused) {
      args[0] = 0; // elapsed to 0
      args[4].keyDown = () => false;
    }

    if (this.game.gameLoopFn) {
      // Whenever we set runError we risk forcing a rerender of the Editor...
      let errorThisLoop = undefined;
      try {
        this.game.listeningKeys = undefined;
        this.game.gameLoopFn.apply(this.game.gameLoopFn, args);
      } catch (error) {
        errorThisLoop = this.game.runError = error;
      }

      if (!errorThisLoop) {
        this.game.runError = undefined;
      }
    }
  }
}