if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./auth/passport');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const connectToDb = require('./db/mongoDb');

connectToDb();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use('/', postRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
