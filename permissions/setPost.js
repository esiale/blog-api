const Post = require('../models/Post');

const setPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).exec();
    if (!post) return next({ status: 404, message: 'Post not found' });
    res.post = post;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = setPost;
