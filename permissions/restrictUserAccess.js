const restrictUserAccess = (req, res, next) => {
  if (req.user.role !== 'admin' && !req.user._id.equals(res.user._id)) {
    return next({ status: 403, message: 'Insufficient permissions' });
  }
  next();
};

module.exports = restrictUserAccess;
