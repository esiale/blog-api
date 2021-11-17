const User = require('../models/User');
const { body, validationResult } = require('express-validator');

exports.signup = [
  (req, res, next) => {
    next();
  },
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ max: 20 })
    .withMessage('Username must be shorter than 20 characters.')
    .escape()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ username: value }).exec();
        if (user) return Promise.reject('User already exists.');
      } catch (err) {
        res.status(400);
        return next(err);
      }
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  async (req, res, next) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array() });
    }
    try {
      await user.save();
      return res.json('User created successfully.');
    } catch (err) {
      return next(err);
    }
  },
];

exports.login = (req, res, next) => {
  res.json('test');
};
