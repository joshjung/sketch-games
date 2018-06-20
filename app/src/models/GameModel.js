import {Model} from 'ringa';

// TODO: babel standalone is HUGE. We need to do the following:
//
// 1) Save the published transpiled JS to the DB so it doesn't have to be done
//    when the game is loaded
// 2) Use the dynamic `import('@babel/standalone).then()` syntax to load the
//    processor dynamically when the editor is loaded.

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
    this.addProperty('version', 0);
    this.addProperty('published', false);
    this.addProperty('publishedDate', undefined);
    this.addProperty('publishedVersion', undefined);
    this.addProperty('publishedTitle', undefined);
    this.addProperty('publishedInstructions', undefined);
    this.addProperty('publishedDescription', undefined);
    this.addProperty('publishedGameLoopFnText', undefined);
    this.addProperty('highscores', []);
    this.addProperty('playCount', 0);
    this.addProperty('dirty', false);
    this.addProperty('history', []);
    this.addProperty('assets', []);

    this.addProperty('listeningKeys', undefined);
    this.addProperty('activeKeys', undefined);
  }

  get development() {
    return this.mode === 'development';
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

  get sortedHistory() {
    const h = this.history || [];
    const sorted = h.sort((hs1, hs2) => {
      if (hs1.score === hs2.score) {
        return hs1.timestamp < hs2.timestamp ? 1 : -1;
      }
      return hs1.score < hs2.score ? 1 : -1;
    });

    return sorted;
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
      'publishedVersion',
      'publishedTitle',
      'publishedInstructions',
      'publishedDescription',
      'publishedGameLoopFnText'
    ];
  }

  serialize(options) {
    const serialized = super.serialize(options);

    // Find all dirty assets and send those
    const updatedAssets = this.assets ? this.assets.filter(a => a.dirty) : undefined;

    if (updatedAssets) {
      serialized.assets = updatedAssets;
    }

    return serialized;
  }

  getAssetUrl(asset) {
    // TODO ensure that contentType is an image!
    if (asset.asset && asset.contentType) {
      return asset.dataUrl = `data:${asset.contentType};base64,${asset.asset}`;
    }

    return '';
  }

  /**
   * This function exists so we can reset game assets while the game is running.
   *
   * @returns {Promise}
   */
  initializeAssets() {
    return new Promise(resolve => {
      if (this.assets && this.assets.length) {
        let processed = 0;
        const toProcess = this.assets.length;

        this.assets.forEach(asset => {
          const image = asset._image = new Image();

          image.onload = function() {
            processed++;

            if (processed == toProcess) {
              resolve();
            }
          };

          image.src = this.getAssetUrl(asset);
        });

      }

      resolve();
    });
  }

  initialize() {
    return new Promise(resolve => {
      this.initializeAssets().then(() => {
        resolve();
      });
    });
  }

  publish() {
    this.published = true;
    this.publishedDate = new Date().getTime();
    this.publishedTitle = this.title;
    this.publishedDescription = this.description;
    this.publishedInstructions = this.instructions;
    this.publishedGameLoopFnText = this.gameLoopFnText;
    this.publishedVersion = this.version;
  }

  screenshot() {
    if (this.renderer) {
      return this.renderer.canvas.toDataURL();
    }
  }

  unpublish() {
    this.published = false;
    this.publishedVersion = undefined;
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
      fn = new Function('E', 'R', 'C', 'G', 'I', 'T', 'M', 'S', es5Output);
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
