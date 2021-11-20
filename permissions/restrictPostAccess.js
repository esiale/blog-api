const restrictPostAccess = (req, res, next) => {
  if (req.user.role !== 'admin' && !req.user._id.equals(res.post.author)) {
    return next({ status: 403, message: 'Insufficient permissions' });
  }
  next();
};

module.exports = restrictPostAccess;
