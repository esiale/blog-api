if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const passportConfig = require('./auth/auth');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const s3Route = require('./routes/s3Route');
const commentRoutes = require('./routes/commentRoutes');
const connectToDb = require('./config/mongoDb');

connectToDb();

const app = express();

const corsOptions = {
  origin: [process.env.cms_url, process.env.front_url],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(morgan('dev'));

app.use('/', postRoutes);
app.use('/', s3Route);
app.use('/auth', authRoutes);
app.use('/posts', commentRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
