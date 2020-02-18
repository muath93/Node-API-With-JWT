const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// import routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

const app = express();

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log('connected to DB')
);

app.use(express.json());

// route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
