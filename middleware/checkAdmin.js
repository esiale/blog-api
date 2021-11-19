module.exports = (req, res, next) => {
  if (req.user.permissions !== 1) {
    return next({ status: 403, message: 'Insufficient permissions' });
  }
  next();
};
