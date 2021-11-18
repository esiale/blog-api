const Post = require('../models/Post');
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
