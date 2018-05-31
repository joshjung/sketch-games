import mongoose, { Schema } from 'mongoose';
import { env } from '../../config';

import User from '../user/model';

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
  playCount: {
    type: Number
  }
}, {
  timestamps: true
});

gameSchema.methods = {
  view (full) {
    let view = {};
    let fields = [
      'id',
      'title',
      'image',
      'instructions',
      'description',
      'published',
      'publishedDate',
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

    if (full) {
      fields = [...fields, 'history', 'createdAt']
    }

    fields.forEach(field => view[field] = this[field]);

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
  highscore (userId, score, time, name) {
    return new Promise((response) => {
      this.highscores = this.highscores || [];

      this.highscores.push({
        userId,
        score,
        time,
        name
      });

      this.save().then(() => response({success: true, highscores: this.highscores}));
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
