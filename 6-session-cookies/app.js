const path = require('path');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();
const store = new MongoDBStore({
  uri: process.env.DATABASE_URL,
  collection:'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'theSessionsSecret',
  resave: false,
  saveUninitialized: false,
  store
}))
app.use((req, res, next) => {
  if (!req.session.user) return next();
  const user = JSON.parse(req.session.user);
  User.findById(user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
mongoose
  .connect(process.env.DATABASE_URL)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: process.env.USER_NAME,
          email: process.env.USER_EMAIL,
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    console.log('connected to database')
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
