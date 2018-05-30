import mongoose, { Schema } from 'mongoose';
import { env } from '../../config';

import User from '../user/model';

const gameSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  gameLoopFnText: {
    type: String
  },
  instructions: {
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
  }
}, {
  timestamps: true
});

gameSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['id', 'title', 'instructions', 'gameLoopFnText', 'ownerUserId', 'originalGameId', 'clonedFromGameId'];

    if (full) {
      fields = [...fields, 'createdAt']
    };

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
          instructions: this.instructions,
          gameLoopFnText: this.gameLoopFnText,
          originalGameId: this.originalGameId || this.id,
          clonedFromGameId: this.id,
          ownerUserId: userId
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
