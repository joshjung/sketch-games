import {Model} from 'ringa';

import * as Babel from '@babel/standalone';

import NEW_GAME_CODE from '../assets/newGameCode.txt';
import NEW_GAME_INSTRUCTIONS from '../assets/newGameInstructions.txt';

export default class GameModel extends Model {
  static STATE_NOT_STARTED = 0;

  constructor(name, values, options) {
    super(name, values);

    this.options = options;

    this.addProperty('mode', 'development');

    this.addProperty('gameLoopFn', '');
    this.addProperty('gameLoopFnText', NEW_GAME_CODE);
    this.addProperty('instructions', NEW_GAME_INSTRUCTIONS);
    this.addProperty('description', '');
    this.addProperty('syntaxError', undefined);
    this.addProperty('runError', undefined);
    this.addProperty('title', 'My Game');
    this.addProperty('image', undefined);
    this.addProperty('state', GameModel.STATE_NOT_STARTED);
    this.addProperty('backgroundColor', 0x000000);
    this.addProperty('gameContainer');
    this.addProperty('exposedState', {});
    this.addProperty('paused', false);
    this.addProperty('ownerUserId', undefined);
    this.addProperty('owner', undefined);
    this.addProperty('startTime', 0);
    this.addProperty('timePlayed', 0);
    this.addProperty('published', false);
    this.addProperty('publishedDate', undefined);
    this.addProperty('publishedTitle', undefined);
    this.addProperty('publishedInstructions', undefined);
    this.addProperty('publishedDescription', undefined);
    this.addProperty('publishedGameLoopFnText', undefined);
    this.addProperty('highscores', []);
    this.addProperty('playCount', 0);
    this.addProperty('dirty', false);

    this.addProperty('listeningKeys', undefined);
    this.addProperty('activeKeys', undefined);
  }

  get indexedText() {
    return `${this.activeTitle} ${this.activeDescription} ${this.owner.name}`;
  }

  get activeTitle() {
    return this.mode === 'development' ? this.title : this.publishedTitle;
  }

  get activeDescription() {
    return this.mode === 'development' ? this.description : this.publishedDescription;
  }

  get activeInstructions() {
    return this.mode === 'development' ? this.instructions : this.publishedInstructions;
  }

  get activeGameLoopFnText() {
    return this.mode === 'development' ? this.gameLoopFnText : this.publishedGameLoopFnText;
  }

  get sortedHighscores() {
    const hs = this.highscores || [];

    return hs.sort((hs1, hs2) => {
      if (hs1.score === hs2.score) {
        return hs1.timestamp < hs2.timestamp ? 1 : -1;
      }
      return hs1.score < hs2.score ? 1 : -1;
    });
  }

  get serializeProperties() {
    return [
      'title',
      'image',
      'gameLoopFnText',
      'ownerUserId',
      'instructions',
      'description',
      'published',
      'publishedDate',
      'publishedTitle',
      'publishedInstructions',
      'publishedDescription',
      'publishedGameLoopFnText'
    ];
  }

  publish() {
    this.published = true;
    this.publishedDate = new Date().getTime();
    this.publishedTitle = this.title;
    this.publishedDescription = this.description;
    this.publishedInstructions = this.instructions;
    this.publishedGameLoopFnText = this.gameLoopFnText;
  }

  screenshot() {
    if (this.renderer) {
      return this.renderer.canvas.toDataURL();
    }
  }

  unpublish() {
    this.published = false;
  }

  reset() {
    this.setGameFunctionFromString(this.activeGameLoopFnText);

    this.playRecorded = false;

    this.syntaxError = this.runError = undefined;
    this.exposedState = {};
    this.paused = false;
    this.startTime = new Date().getTime();
    this.timePlayed = 0;

    this.notify('reset');
  }

  setGameFunctionFromString(gameLoopFnString) {
    let fn;

    // We reset the state completely when the function changes (e.g. during editor mode)
    this.exposedState = {};

    try {
      const es5Output = Babel.transform(gameLoopFnString, { presets: ['es2015'] }).code;
      fn = new Function('E', 'R', 'C', 'G', 'I', 'T', 'M', es5Output);
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
