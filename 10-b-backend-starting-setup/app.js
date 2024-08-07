const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const app = express();
const feedRoutes = require('./routes/feed');

const fileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'images');
   },
   filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
   }
});

const fileFilter = (req, file, cb) => {
   if (file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
   ) {
      cb(null, true);
   } else {
      cb(null, false);
   }
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
});
app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
   console.error(error);
   const status = error.statusCode || 500;
   const message = error.message;
   res.status(status).json({ message: message });
});

mongoose.connect(process.env.DATABASE_URL)
   .then(result => {
      app.listen(8080);
      console.log('Connected to Server');
   })
   .catch(err => {
      console.log('Error connecting to server:', err);
   });
