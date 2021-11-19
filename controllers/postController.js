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
    res.status(201);
    return res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.post_create = [
  body('author').notEmpty().withMessage('Author is required.'),
  body('body').notEmpty().withMessage("Post body can't be empty."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array() });
    }
    const post = new Post({
      author: req.body.author,
      body: req.body.body,
    });
    try {
      await post.save();
      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },
];

exports.post_delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findOneAndDelete({ _id: id }).exec();
    if (!post) return next({ status: 404, message: 'Post not found' });
    return res.json({ deleted: id });
  } catch (err) {
    next(err);
  }
};

exports.post_update = [
  body('body').notEmpty().withMessage("Post body can't be empty."),
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array() });
    }
    const updatedPost = {
      body: req.body.body,
    };
    try {
      const post = await Post.findOneAndUpdate({ _id: id }, updatedPost, {
        new: true,
      }).exec();
      if (!post) return next({ status: 404, message: 'Post not found' });
      return res.json(post);
    } catch (err) {
      next(err);
    }
  },
];
