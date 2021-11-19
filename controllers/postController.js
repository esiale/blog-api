const Post = require('../models/Post');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

exports.posts_list = async (req, res, next) => {
  const limit = Number(req.query.limit);
  const { start } = req.query;
  let posts;
  try {
    if (!start) {
      posts = await Post.find().sort({ _id: -1 }).limit(limit).exec();
    } else {
      posts = await Post.find({ _id: { $lt: start } })
        .sort({ _id: -1 })
        .limit(limit)
        .exec();
    }
    const count = await Post.find().count();
    const next = posts[posts.length - 1]._id;
    return res.json({ count, next, posts });
  } catch (err) {
    next(err);
  }
};

exports.post_details = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) return next({ status: 404, message: 'Post not found' });
    return res.json(post);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next({ status: 404, message: 'Post not found' });
    }
    next(err);
  }
};

exports.post_create = [
  body('author').notEmpty().withMessage('Author is required.'),
  body('body').notEmpty().withMessage("Post body can't be empty."),
  async (req, res, next) => {
    const post = new Post({
      author: req.body.author,
      body: req.body.body,
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array() });
    }
    try {
      await post.save();
      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },
];
