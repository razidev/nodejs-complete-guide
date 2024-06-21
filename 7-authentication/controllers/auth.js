const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const  { validationResult } =  require('express-validator')
const nodemailer = require('nodemailer');
const User = require('../models/user');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD
  }
})

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length) {
    message = message[0]
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: { email: '', password: '' },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length) {
    message = message[0]
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      const payloadRenderError = {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password',
        oldInput: { email, password },
        validationErrors: []
      };
      if (!user) {
        return res.status(422).render('auth/login', payloadRenderError);
      }
      bcrypt.compare(password, user.password)
       .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
        return res.status(422).render('auth/login', payloadRenderError);
       })
       .catch(err => {
          console.log(err);
          return res.redirect('/login');
       })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12).then(hashedPassword => {
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: []}
    })
    return user.save();
  })
  .then(result => {
    res.redirect('/login');
    return transporter.sendMail({
      to: email,
      from: 'razi-lear@nodejs.id',
      subject: 'Signup Succesfull',
      html: '<h1>Signup Succesfull</h1>'
    })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length) {
    message = message[0]
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};


exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buf) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buf.toString('hex');
    User.findOne({ email: req.body.email })
   .then(user => {
      if(!user) {
        req.flash('error', 'No account with this email found')
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
   })
   .then(result => {
    res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from: 'razi-lear@nodejs.id',
        subject: 'Password Reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
        `
      })
   })
   .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
   .then(user => {
    let message = req.flash('error');
    if (message.length) {
      message = message[0]
    } else {
      message = null;
    }

    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
   })
   .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;
  User.findOne({
    resetToken:  passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
   .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password =  hashedPassword;
      resetUser.resetToken =  undefined;
      resetUser.resetTokenExpiration =  undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};