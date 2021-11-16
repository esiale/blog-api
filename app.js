if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const connectToDb = require('./db/mongoDb');

connectToDb();

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
