import GraphicContainer from '../../core/GraphicContainer';

import Keyboard from '../../input/Keyboard';
import Mouse from '../../input/Mouse';

import APIController from '../../controllers/APIController';

import * as RenderAPI from '../../api/R';
import * as MathAPI from '../../api/M';

export default class GameContainer extends GraphicContainer {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(gameController, options, id) {
    super(options, id);

    this.gameModel = gameController.gameModel;
    this.gameController = gameController;

    this.keyboard = new Keyboard(this.gameModel);

    this.gameModel.keyboard = this.keyboard;

    gameController.gameModel.watch(signal => {
      if (signal === 'reset') {
        this.keyboard = new Keyboard(this.gameModel); // We have to reset the keys
        this.gameModel.keyboard = this.keyboard;
      }
    })
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  recordScore(score) {
    const isHighscore = !this.gameModel.highscores ||
      this.gameModel.highscores.length < 50 ||
      this.gameModel.highscores.find(hs => hs.score < score);

    if (isHighscore) {
      if (this.gameModel.mode === 'published') {
        setTimeout(() => {
          this.gameModel.gameCanvas.dispatch(APIController.RECORD_HIGHSCORE, {
            id: this.gameModel.id,
            score,
            time: this.gameModel.timePlayed
          }).then($lastPromiseResult => {
            if ($lastPromiseResult.success) {
              this.gameModel.highscores = $lastPromiseResult.highscores;
              console.log('new highscores', this.gameModel.highscores);
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
      rect: RenderAPI.rect.bind(this, this.renderer.ctx)
    };

    const C = this.renderer.ctx;

    const G = Object.assign(this.gameModel.exposedState, {
      recordScore: this.recordScore.bind(this),
      paused: this.gameModel.paused
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
      total: this.gameModel.timePlayed
    };

    const M = {
      seed: MathAPI.seed.bind(this),
      rand: MathAPI.rand.bind(this)
    };

    const S = {};

    const args = [E, R, C, G, I, T, M, S];

    if (this.gameModel.paused) {
      args[0] = 0; // elapsed to 0
      args[4].keyDown = () => false;
    }

    if (this.gameModel.gameLoopFn) {
      try {
        this.gameModel.listeningKeys = undefined;
        this.gameModel.gameLoopFn.apply(this.gameModel.gameLoopFn, args);
      } catch (error) {
        this.gameModel.runError = error;
      }
    }
  }
}