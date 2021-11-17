const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

passport.use(
  new LocalStrategy('local', (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user || !user.isValidPassword(password)) {
        return done(null, false, {
          message: 'Incorrect username and/or password.',
        });
      }
      return done(null, user);
    });
  })
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.secret_token,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    function (jwt_payload, done) {
      User.findOne({ id: jwt_payload.sub }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
      });
    }
  )
);
