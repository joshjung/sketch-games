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
  history: {
    type: [{}]
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
      'clonedFromGameId'
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
          publishedDate: undefined
        };

        Game.create(body).then(clonedGame => {
          response(clonedGame);
        }).catch(error => {
          console.error(error);

          fail(error);
        });
    });
  }
};

const Game = mongoose.model('Game', gameSchema);

export const schema = Game.schema;
export default Game;
