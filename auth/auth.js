const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.auth = (req, res, next) => {
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
      const body = { _id: user._id, username: user.username };
      const token = jwt.sign({ user: body }, process.env.secret_token);

      return res.json({ user, token });
    });
  })(req, res, next);
};
