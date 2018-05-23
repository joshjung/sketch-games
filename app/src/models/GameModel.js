import {Model} from 'ringa';

export default class GameModel extends Model {
  static STATE_NOT_STARTED = 0;

  constructor(name, id, options) {
    super(name, id, options);

    this.addProperty('gameLoopFn', '');
    this.addProperty('gameLoopFnText', '// Javascript here');
    this.addProperty('syntaxError', undefined);
    this.addProperty('runError', undefined);
    this.addProperty('title', 'My Game');
    this.addProperty('state', GameModel.STATE_NOT_STARTED);
    this.addProperty('backgroundColor', 0x000000);
    this.addProperty('gameContainer');
  }

  get serializeProperties() {
    return ['title', 'gameLoopFnText'];
  }

  setGameFunctionFromString(gameLoopFnString) {
    let fn;

    try {
      fn = new Function('elapsed', 'ctx', 'model', 'controller', gameLoopFnString);
      this.gameLoopFn = fn;

      this.gameLoopFnText = gameLoopFnString;
      this.syntaxError = this.runError = undefined;

      return true;
    } catch (error) {
      console.error(error);
      this.syntaxError = error.toString();
    }

    return false;
  }
}
