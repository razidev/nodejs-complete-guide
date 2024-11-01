require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { graphqlHTTP } = require('express-graphql')

const auth = require('./middleware/auth');
const { clearImage } = require('./util/file');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();

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
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

   if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
   }
   next();
});

app.use(auth);

app.put('/image', (req, res, next) => {
   if (!req.isAuth) {
      return res.status(401).json({ message: 'Unauthorized' });
   }
   if (!req.file) {
      return res.status(200).json({ message: 'No file provided' });
   }
   if (req.body.oldPath) {
      clearImage(req.body.oldPath);
   }
   
   return res.status(201).json({
      message: 'File successfully uploaded',
      filePath: req.file.path.replace(/\\/g, '/')
   });
});

app.use('/graphql', graphqlHTTP({
   schema: graphqlSchema,
   rootValue: graphqlResolver,
   graphiql: true,
   formatError(err) {
      if (!err.originalError) {
         return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred';
      const code = err.originalError.code || 500;
      return { message, status: code, data };
   }
}));

app.use((error, req, res, next) => {
   console.error(error);
   const status = error.statusCode || 500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({ message, data });
});

mongoose.connect(process.env.DATABASE_URL)
   .then(() => {
      app.listen(8080);
   })
   .catch(err => {
      console.log('Error connecting to server:', err);
   });
