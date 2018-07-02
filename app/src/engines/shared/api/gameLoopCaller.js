import * as RenderAPI from './R';
import * as MathAPI from './M';
import * as GameAPI from './G';
import * as AssetAPI from './A';

export function buildAndCallGameLoop({game, elapsed, ctx, keyboard, mouse}) {
  const E = elapsed;

  const R = {
    text: RenderAPI.text.bind(this, ctx),
    poly: RenderAPI.poly.bind(this, ctx),
    circle: RenderAPI.circle.bind(this, ctx),
    bg: RenderAPI.background.bind(this, ctx),
    rect: RenderAPI.rect.bind(this, ctx),
    drawImage: RenderAPI.drawImage.bind(this, ctx, game)
  };

  const C = ctx;

  const G = Object.assign(game.exposedState, {
    restart: GameAPI.restart.bind(this, game),
    recordScore: GameAPI.recordScore.bind(this, game),
    paused: game.paused
  });

  let I;

  if (keyboard && mouse) {
    I = Object.assign({
      keyDown: keyboard.keyDown,
      keyCodes: keyboard.keyCodes,
      mouseX: mouse.mouseX,
      mouseY: mouse.mouseY,
      keyActionNames: keyboard.keyActionNames,
      keyColors: keyboard.keyColors
    }, keyboard.keyCodes);
  }

  const T = {
    elapsed,
    now: new Date().getTime(),
    total: game.timePlayed
  };

  const M = {
    seed: MathAPI.seed.bind(this),
    rand: MathAPI.rand.bind(this)
  };

  const S = {};

  const L = game._libs;

  const A = {
    getAsset: AssetAPI.getAsset.bind(this, game)
  };

  const args = [E, R, C, G, I, T, M, S, L, A];

  if (game.paused) {
    args[0] = 0; // elapsed to 0
    args[4].keyDown = () => false;
  }

  if (game.gameLoopFn) {
    // Whenever we set runError we risk forcing a rerender of the Editor...
    let errorThisLoop = undefined;
    try {
      game.listeningKeys = undefined;

      //-------------------------------------------
      // CALL THE MAIN GAME LOOP
      //-------------------------------------------
      game.gameLoopFn.apply(game.gameLoopFn, args);
    } catch (error) {
      errorThisLoop = game.runError = error;
    }

    if (!errorThisLoop) {
      game.runError = undefined;
    }
  }
}