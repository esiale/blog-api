const Post = require('../models/Post');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

exports.commentAdd = [
  body('author')
    .trim()
    .notEmpty()
    .withMessage("Name can't be empty.")
    .isLength({ max: 20 })
    .withMessage('Name must be shorter than 20 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage("Email can't be empty.")
    .isEmail()
    .withMessage('Email is incorrect.')
    .normalizeEmail(),
  body('body')
    .trim()
    .notEmpty()
    .withMessage("Comment can't be empty.")
    .isLength({ max: 200 })
    .withMessage('Comment must be shorter than 200 characters.'),
  async (req, res, next) => {
    const { postId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array() });
    }
    try {
      const post = await Post.findById(postId).exec();
      if (!post) return next({ status: 404, message: 'Post not found' });
      const comment = {
        author: req.body.author,
        email: req.body.email,
        body: req.body.body,
      };
      post.comments.push(comment);
      await post.save();
      res.status(201);
      res.json(post);
    } catch (err) {
      next(err);
    }
  },
];

exports.commentDelete = async (req, res, next) => {
  const { postId, commentId } = req.params;
  try {
    const post = await Post.findById(postId).exec();
    if (!post) return next({ status: 404, message: 'Post not found' });
    const comment = post.comments.id(commentId);
    if (!comment) return next({ status: 404, message: 'Comment not found' });
    comment.remove();
    await post.save();
    return res.json({ deleted: commentId });
  } catch (err) {
    next(err);
  }
};
