const restrictToRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== role) {
      return next({ status: 403, message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = restrictToRole;
