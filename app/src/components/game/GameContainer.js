import GraphicContainer from '../../core/GraphicContainer';

import Keyboard from '../../input/Keyboard';

export default class GameContainer extends GraphicContainer {
  constructor(gameController, options, id) {
    super(options, id);

    this.gameModel = gameController.gameModel;
    this.gameController = gameController;

    this.keyboard = new Keyboard();
  }

  renderText(text, x, y, color, font, baseline) {
    let ctx = this.renderer.ctx;

    baseline = baseline || 'hanging';

    ctx.fillStyle = color;
    ctx.font = font || '30px Arial';
    ctx.textBaseline = baseline;

    ctx.fillText(text, x, y);
  }

  onFrameHandler(elapsed) {
    const E = elapsed;
    const R = {
      text: this.renderText.bind(this)
    };
    const C = this.renderer.ctx;
    const G = this.gameModel.exposedState;
    const I = Object.assign({
      keyDown: this.keyboard.keyDown,
      keyCodes: this.keyboard.keyCodes,
    }, this.keyboard.keyCodes);

    const args = [E, R, C, G, I];

    if (this.gameModel.paused) {
      args[0] = 0; // elapsed to 0
      args[4].keyDown = () => false;
    }

    if (this.gameModel.gameLoopFn) {
      try {
        this.gameModel.gameLoopFn.apply(this.gameModel.gameLoopFn, args);
      } catch (error) {
        this.gameModel.runError = error.toString();
      }
    }
  }
}