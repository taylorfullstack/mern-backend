require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path');
const app = express();

//MongoDB Atlas connection
const dbname = process.env.DB_NAME;
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

const uri = `mongodb+srv://${username}:${password}@${dbname}/?retryWrites=true&w=majority`

mongoose.connect(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Success! Connected to MongoDB !'))
  .catch((err) => console.log('Oh no :/ MongoDB Connection failed', err));

//body-parser is no longer needed in Express 4.16+, but could be present in older projects
//middleware to intercept requests and extract the JSON object from the request body (req.body)
app.use(express.json());

//CORS error fix (Cross-Origin Resource Sharing)
//applies to all routes
//headers configured for the response object
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;