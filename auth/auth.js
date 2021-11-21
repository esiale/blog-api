const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

passport.use(
  new LocalStrategy('local', async (username, password, done) => {
    let user;
    try {
      user = await User.findOne({ username }).exec();
      if (!user || !(await await user.isValidPassword(password))) {
        return done(null, false, {
          message: 'Incorrect username and/or password.',
        });
      }
    } catch (err) {
      return done(err);
    }
    return done(null, user);
  })
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.secret_token,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwt_payload, done) => {
      const user = await User.findOne({ _id: jwt_payload.user._id }).exec();
      try {
        if (user) return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
