const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const feedRoutes = require('./routes/feed');

app.use(bodyParser.json());
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
});
app.use('/feed', feedRoutes);

mongoose.connect(process.env.DATABASE_URL)
   .then(result => {
      app.listen(8080);
      console.log('Connected to Server');
   })
   .catch(err => {
      console.log('Error connecting to server:', err);
   });
