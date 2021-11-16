const mongoose = require('mongoose');

module.exports = () => {
  const mongoDb = process.env.MONGODB_URI || process.env.dev_db_url;
  mongoose.connect(mongoDb, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Mongo connection error'));
};
