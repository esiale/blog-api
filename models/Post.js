const mongoose = require('mongoose');
const comment = require('./Comment');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: false,
  },
  comments: [comment],
});

module.exports = mongoose.model('Post', postSchema);
