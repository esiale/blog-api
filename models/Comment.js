const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: String, required: true },
  email: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = commentSchema;
