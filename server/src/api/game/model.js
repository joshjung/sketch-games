import mongoose, { Schema } from 'mongoose';
import { env } from '../../config';

import User from '../user/model';

import * as JsDiff from 'diff';

const HIGHSCORE_MAX_COUNT = 100;

const gameSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String // Stored as base64 toDateUrl format from canvas
  },
  gameLoopFnText: {
    type: String
  },
  instructions: {
    type: String
  },
  description: {
    type: String
  },
  ownerUserId: {
    type: String,
    required: true
  },
  originalGameId: {
    type: String
  },
  clonedFromGameId: {
    type: String
  },
  published: {
    type: Boolean
  },
  publishedVersion: {
    type: Number
  },
  publishedDate: {
    type: Date
  },
  publishedTitle: {
    type: String
  },
  publishedInstructions: {
    type: String
  },
  publishedDescription: {
    type: String
  },
  publishedGameLoopFnText: {
    type: String
  },
  highscores: {
    type: [{}]
  },
  history: {
    type: [{}]
  },
  version: {
    type: Number,
    default: 0
  },
  playCount: {
    type: Number
  },
  assets: {
    type: [{
      assetId: {
        type: String
      },
      description: {
        type: String
      },
      groupId: {
        type: String
      },
      type: {
        type: String
      },
      contentType: {
        type: String
      },
      asset: {
        type: Buffer
      }
    }]
  }
}, {
  timestamps: true
});

gameSchema.methods = {
  saveWithHistory (body) {
    /**
     * HISTORY MANAGEMENT
     *
     * If the game code has changed, add it to the history
     */
    if (body.gameLoopFnText !== undefined && this.gameLoopFnText !== body.gameLoopFnText) {
      const diffs = JsDiff.diffChars(this.gameLoopFnText || '', body.gameLoopFnText);

      this.history = this.history || [];
      this.version++;
      this.history.push({
        timestamp: new Date().getTime(),
        gameLoopFnText: body.gameLoopFnText,
        userId: body.userId,
        version: this.version,
        diff: diffs
      });
    }

    return new Promise(resolve => {
      Object.assign(this, body).save().then(() => this.view('history, createdAt').then(view => {
        resolve(view);
      }));
    });
  },
  getAssets() {
    return Promise.resolve(this.assets);
  },
  addAsset (assetId, description, asset, type, contentType, groupId) {
    this.assets.push({
      assetId,
      description,
      asset,
      type,
      contentType,
      groupId
    });

    return this.save().then(result => this.view('assets, history, createdAt'));
  },
  getAsset(assetId) {
    const asset = this.assets.find(a => a.assetId === assetId);

    return Promise.resolve(asset);
  },
  deleteAsset(assetId) {
    this.assets = this.assets.filter(a => a.assetId !== assetId);

    return this.save().then(result => this);
  },
  view (addFields) {
    let view = {};
    let fields = [
      'id',
      'title',
      'image',
      'version',
      'instructions',
      'description',
      'published',
      'publishedDate',
      'publishedVersion',
      'publishedTitle',
      'publishedInstructions',
      'publishedDescription',
      'publishedGameLoopFnText',
      'gameLoopFnText',
      'ownerUserId',
      'originalGameId',
      'clonedFromGameId',
      'highscores',
      'playCount'
    ];

    if (addFields) {
      addFields = addFields.split(',');
      fields = [...fields, ...addFields];
    }

    fields.forEach(field => view[field] = this[field]);

    if (view.assets) {
      view.assets = view.assets.map(asset => {
        if (!asset.asset || asset.asset.length > 50000) {
          return {
            assetId: asset.assetId,
            groupId: asset.groupId,
            description: asset.description,
            type: asset.type,
            contentType: asset.contentType,
            byteSize: asset.asset ? asset.asset.length : -1,
            overflow: true
          };
        }

        return {
          assetId: asset.assetId,
          groupId: asset.groupId,
          description: asset.description,
          type: asset.type,
          contentType: asset.contentType,
          overflow: false,
          byteSize: asset.asset ? asset.asset.length : -1,
          asset: asset.asset ? asset.asset.toString('base64') : ''
        };
      });

      console.log(view.assets);
    }

    const showFullHighscores = addFields && addFields.indexOf('highscoresFull') !== -1;

    if (!showFullHighscores && view.highscores && view.highscores.length) {
      view.highscores = view.highscores.map(hs => {
        let hsClone = {...hs};
        delete hsClone.screenshot;
        return hsClone;
      });
    }

    if (view.ownerUserId) {
      return new Promise(response => {
        User.findById(view.ownerUserId).then(result => {
          view.owner = result;

          response(view);
        });
      });
    }

    return Promise.resolve(view);
  },
  viewHighscore (userId, timestamp) {
    let hsFull = this.highscores.find(hs => (hs.timestamp && hs.timestamp.toString()) === timestamp.toString() && (hs.userId && hs.userId.toString()) === userId.toString());

    hsFull = hsFull ? {
      success: true,
      highscore: hsFull
    } : {
      success: false,
      message: 'Could not find a matching highscore, it might have been deleted'
    };

    return Promise.resolve(hsFull);
  },
  clone (userId) {
    return new Promise((response, fail) => {
        let body = {
          title: this.title + '(duplicated)',
          image: this.image,
          instructions: this.instructions,
          description: this.description,
          history: this.history,
          gameLoopFnText: this.gameLoopFnText,
          originalGameId: this.originalGameId || this.id,
          clonedFromGameId: this.id,
          ownerUserId: userId,
          published: false,
          publishedDate: undefined,
          highscores: [],
          playCount: 0
        };

        Game.create(body).then(clonedGame => {
          response(clonedGame);
        }).catch(error => {
          console.error(error);

          fail(error);
        });
    });
  },
  play (userId) {
    return new Promise((response) => {
      this.playCount = this.playCount || 0;
      this.playCount++;

      this.save().then(() => response({success: true}));
    });
  },
  highscore (userId, score, time, name, screenshot) {
    return new Promise((response) => {
      if (!screenshot) {
        return response({
          success: false,
          message: 'No screenshot provided, score not recorded'
        });
      }

      this.highscores = this.highscores || [];

      this.highscores.sort((hs1, hs2) => {
        return hs1.score < hs2.score ? 1 : -1;
      });

      const isHighScore = !this.highscores.length ||
        this.highscores.length < HIGHSCORE_MAX_COUNT ||
        this.highscores.find(hs => hs.score < score);

      if (isHighScore) {
        this.highscores.push({
          userId,
          score,
          time,
          name,
          timestamp: new Date().getTime(),
          screenshot
        });

        this.highscores = this.highscores.slice(0, HIGHSCORE_MAX_COUNT);

        this.save().then(() => response({
          success: true,
          highscores: this.highscores.map(hs => {
            let hsClone = {...hs};
            delete hsClone.screenshot;
            return hsClone;
          })
        }));
      } else {
        return response({
          success: false,
          message: `${score} is not in the top ${HIGHSCORE_MAX_COUNT}`
        });
      }
    });
  },
  clearHighscores (userId) {
    return new Promise((response) => {
      if (userId !== this.ownerUserId) {
        response({success:false});
      } else {
        this.highscores = [];

        this.save().then(() => response({success: true}));
      }
    });
  }
};

const Game = mongoose.model('Game', gameSchema);

export const schema = Game.schema;
export default Game;
