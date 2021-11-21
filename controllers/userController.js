const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const updateUserRole = async (req, res, next) => {
  if (!req.query.role) return next();
  if (req.user.role !== 'admin') {
    return next({ status: 403, message: 'Insufficient permissions' });
  }
  const { userId } = req.params;
  const { role } = req.query;
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) return next({ status: 404, message: "User doesn't exist." });
    user.role = role;
    await user.save();
    delete user._doc.password;
    res.status(200);
    res.json(user);
  } catch (err) {
    return next(err);
  }
};

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
        const user = await User.findOne({ username: value })
          .select('-password')
          .exec();
        if (user) return Promise.reject('User already exists.');
      } catch (err) {
        return next(err);
      }
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array() });
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    try {
      await user.save();
      res.status(201);
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
        role: user.role,
      };
      const token = jwt.sign({ user: body }, process.env.secret_token);
      return res.json({ user: body, token });
    });
  })(req, res, next);
};

exports.usersList = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) return next({ status: 200, message: 'User list is empty.' });
    users.forEach((user) => {
      delete user._doc.password;
    });
    res.status(200);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.userDetails = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return next({ status: 404, message: "User doesn't exist." });
    delete user._doc.password;
    res.status(200);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.userUpdate = [
  updateUserRole,
  body('username')
    .optional()
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
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ status: 400, message: errors.array() });
    }
    const { userId } = req.params;
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) return next({ status: 404, message: "User doesn't exist." });
      Object.assign(
        user,
        req.body.username ? { username: req.body.username } : user.username,
        req.body.password ? { password: req.body.password } : null
      );
      await user.save();
      delete user._doc.password;
      res.status(201);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  },
];

exports.userDelete = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });
    const userPosts = await Post.find({ author: userId });
    if (!user) return next({ status: 404, message: "User doesn't exist." });
    if (userPosts && !req.query.force) {
      return next({
        status: 409,
        message:
          'This user has associated posts. Run this request with query ?force=true to remove the user with all their content.',
        posts: { userPosts },
      });
    } else if (userPosts && req.query.force === 'true') {
      await Post.deleteMany({ author: userId });
    }
    await User.deleteOne({ user });
    res.json({ status: 200, message: `deleted: ${user._id}` });
  } catch (err) {
    return next(err);
  }
};
