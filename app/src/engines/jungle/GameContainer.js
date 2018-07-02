import GraphicContainer from './core/GraphicContainer';

import Keyboard from '../shared/core/input/Keyboard';
import Mouse from '../shared/core/input/Mouse';

import {buildAndCallGameLoop} from '../shared/api/gameLoopCaller';

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
  // Events
  //-----------------------------------
  onFrameHandler(elapsed) {
    if (!this.mouse) {
      this.mouse = new Mouse(this.renderer.canvas);
    }

    buildAndCallGameLoop({
      game: this.game,
      elapsed,
      ctx: this.renderer.ctx,
      keyboard: this.keyboard,
      mouse: this.mouse
    });
  }
}