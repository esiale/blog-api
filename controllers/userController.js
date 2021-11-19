const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.signup = [
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
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(403).json(info);
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      const body = {
        _id: user._id,
        username: user.username,
        permissions: user.permissions,
      };
      const token = jwt.sign({ user: body }, process.env.secret_token);
      return res.json({ user: body, token });
    });
  })(req, res, next);
};
