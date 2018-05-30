import {Model} from 'ringa';

import * as Babel from '@babel/standalone';

export default class GameModel extends Model {
  static STATE_NOT_STARTED = 0;

  constructor(name, values, options) {
    super(name, values);

    this.options = options;

    this.addProperty('gameLoopFn', '');
    this.addProperty('gameLoopFnText', '// Javascript here');
    this.addProperty('instructions', 'Enter your game instructions using Markdown syntax');
    this.addProperty('syntaxError', undefined);
    this.addProperty('runError', undefined);
    this.addProperty('title', 'My Game');
    this.addProperty('state', GameModel.STATE_NOT_STARTED);
    this.addProperty('backgroundColor', 0x000000);
    this.addProperty('gameContainer');
    this.addProperty('exposedState', {});
    this.addProperty('paused', false);
    this.addProperty('ownerUserId', undefined);
    this.addProperty('startTime', 0);
    this.addProperty('timePlayed', 0);

    if (this.gameLoopFnText) {
      this.setGameFunctionFromString(this.gameLoopFnText);
    }
  }

  get serializeProperties() {
    return ['title', 'gameLoopFnText', 'ownerUserId', 'instructions'];
  }

  reset() {
    this.syntaxError = this.runError = undefined;
    this.exposedState = {};
    this.paused = false;
    this.startTime = new Date().getTime();
    this.timePlayed = 0;
  }

  setGameFunctionFromString(gameLoopFnString) {
    let fn;

    // We reset the state completely when the function changes (e.g. during editor mode)
    this.exposedState = {};

    try {
      const es5Output = Babel.transform(gameLoopFnString, { presets: ['es2015'] }).code;
      fn = new Function('E', 'R', 'C', 'G', 'I', es5Output);
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
