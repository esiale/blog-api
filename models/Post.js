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

postSchema.post(
  ['findById', 'findOneAndUpdate', 'findOneAndDelete'],
  function (err, doc, next) {
    if (err instanceof mongoose.Error.CastError) {
      return next({ status: 404, message: 'Post not found' });
    }
    next(err);
  }
);

module.exports = mongoose.model('Post', postSchema);
