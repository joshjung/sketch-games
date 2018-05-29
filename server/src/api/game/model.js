import mongoose, { Schema } from 'mongoose';
import { env } from '../../config';

const gameSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  gameLoopFnText: {
    type: String
  },
  ownerUserId: {
    type: String
  }
}, {
  timestamps: true
});

gameSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['id', 'title', 'gameLoopFnText', 'ownerUserId'];

    if (full) {
      fields = [...fields, 'createdAt']
    };

    fields.forEach((field) => { view[field] = this[field] });

    return view;
  }
};

const model = mongoose.model('Game', gameSchema);

export const schema = model.schema;
export default model;
