import GraphicContainer from '../../core/GraphicContainer';

import Keyboard from '../../input/Keyboard';
import Mouse from '../../input/Mouse';

export default class GameContainer extends GraphicContainer {
  constructor(gameController, options, id) {
    super(options, id);

    this.gameModel = gameController.gameModel;
    this.gameController = gameController;

    this.keyboard = new Keyboard();

    gameController.gameModel.watch(signal => {
      if (signal === 'reset') {
        this.keyboard = new Keyboard();
      }
    })
  }

  seed(i) {
    this.randSeed = i;
  }

  random() {
    const x = Math.sin(this.randSeed++) * 10000;
    return x - Math.floor(x);
  }

  background(fill) {
    let ctx = this.renderer.ctx;
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, 800, 600);
  }

  text(text, x, y, color, font, baseline) {
    let ctx = this.renderer.ctx;

    baseline = baseline || 'hanging';

    ctx.fillStyle = color;
    ctx.font = font || '30px Arial';
    ctx.textBaseline = baseline;

    ctx.fillText(text, x, y);
  }

  circle(center, radius, stroke, fill) {
    let ctx = this.renderer.ctx;

    if (fill) {
      ctx.fillStyle = fill;
    }

    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.closePath();

    if (fill) {
      ctx.fill();
    }

    if (stroke) {
      ctx.stroke();
    }
  }

  poly(poly, {fill = undefined, angle = 0, center = [0, 0]} = {}) {
    let ctx = this.renderer.ctx;

    if (fill) {
      ctx.fillStyle = fill;
    }

    if (angle || center) {
      poly = poly.concat();

      for (let i=0 ; i < poly.length-1 ; i+=2) {
        const x = poly[i],
              y = poly[i+1];
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        poly[i] =   x * c - y * s + center[0];
        poly[i+1] = x * s + y * c + center[1];
      }
    }

    ctx.beginPath();
    ctx.moveTo(poly[0], poly[1]);

    for (let i=2 ; i < poly.length-1 ; i+=2) {
      ctx.lineTo( poly[i] , poly[i+1] );
    }

    ctx.closePath();

    if (fill) {
      ctx.fill();
    }
  }

  onFrameHandler(elapsed) {
    if (!this.mouse) {
      this.mouse = new Mouse(this.renderer.canvas);
    }

    const E = elapsed;
    const R = {
      text: this.text.bind(this),
      poly: this.poly.bind(this),
      circle: this.circle.bind(this),
      bg: this.background.bind(this)
    };
    const C = this.renderer.ctx;
    const G = this.gameModel.exposedState;
    const I = Object.assign({
      keyDown: this.keyboard.keyDown,
      keyCodes: this.keyboard.keyCodes,
      mouseX: this.mouse.mouseX,
      mouseY: this.mouse.mouseY
    }, this.keyboard.keyCodes);

    const T = {
      elapsed,
      now: new Date().getTime(),
      total: this.gameModel.timePlayed
    };

    const M = {
      seed: this.seed.bind(this),
      rand: this.random.bind(this)
    };

    const args = [E, R, C, G, I, T, M];

    if (this.gameModel.paused) {
      args[0] = 0; // elapsed to 0
      args[4].keyDown = () => false;
    }

    if (this.gameModel.gameLoopFn) {
      try {
        this.gameModel.gameLoopFn.apply(this.gameModel.gameLoopFn, args);
      } catch (error) {
        this.gameModel.runError = error;
      }
    }
  }
}