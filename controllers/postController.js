const Post = require('../models/Post');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

exports.postsList = async (req, res, next) => {
  const { start, author } = req.query;
  const limit = Number(req.query.limit) || 0;
  let posts, authorQuery;
  try {
    if (author) authorQuery = { author };
    if (!start) {
      posts = await Post.find(authorQuery)
        .sort({ _id: -1 })
        .limit(limit)
        .populate('author', '-password')
        .exec();
    } else {
      posts = await Post.find({ _id: { $lt: start }, ...authorQuery })
        .sort({ _id: -1 })
        .limit(limit)
        .populate('author', '-password')
        .exec();
    }
    const count = await Post.find().count();
    const next = posts.length && start ? posts[posts.length - 1]._id : null;
    return res.json({ count, next, posts });
  } catch (err) {
    next(err);
  }
};

exports.postDetails = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).exec();
    if (!post) return next({ status: 404, message: 'Post not found' });
    res.status(201);
    return res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.postCreate = [
  body('author').notEmpty().withMessage('Author is required.'),
  body('title').notEmpty().withMessage("Title can't be empty."),
  body('body').notEmpty().withMessage("Post body can't be empty."),
  body('imageUrl').notEmpty().withMessage('Image is required.'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const getErrorsMessage = errors
        .array({ onlyFirstError: true })
        .map((error) => {
          return error.msg;
        });
      const mergedErrors = getErrorsMessage.join('. ');
      return next({
        status: 400,
        message: mergedErrors,
      });
    }
    const post = new Post({
      author: req.body.author,
      title: req.body.title,
      body: req.body.body,
      imageUrl: req.body.imageUrl,
    });
    try {
      await post.save();
      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },
];

exports.postDelete = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOneAndDelete({ _id: postId }).exec();
    if (!post) return next({ status: 404, message: 'Post not found' });
    return res.json({ deleted: postId });
  } catch (err) {
    next(err);
  }
};

exports.postUpdate = [
  body('title').optional().notEmpty().withMessage("Title can't be empty."),
  body('body').optional().notEmpty().withMessage("Post body can't be empty."),
  async (req, res, next) => {
    const { postId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array() });
    }
    try {
      const post = await Post.findOne({ _id: postId });
      const updatedPost = {
        title: req.body.title,
        body: req.body.body,
        date: req.body.date,
        imageUrl: req.body.imageUrl,
        published: req.body.published,
      };
      const uploadedPost = await Post.findOneAndUpdate(
        { _id: postId },
        updatedPost,
        {
          new: true,
        }
      ).exec();
      if (!post || !uploadedPost)
        return next({ status: 404, message: 'Post not found' });
      return res.json(uploadedPost);
    } catch (err) {
      next(err);
    }
  },
];
