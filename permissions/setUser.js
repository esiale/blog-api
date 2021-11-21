const User = require('../models/User');

const setUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).exec();
    if (!user) return next({ status: 404, message: 'User not found' });
    res.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = setUser;
