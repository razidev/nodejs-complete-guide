const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
};

exports.postLogin = (req, res, next) => {
    User.findById('65ff1763bd203e139e0e094e')
        .then(user => {
            req.session.user = JSON.stringify(user);
            req.session.isLoggedIn = true;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            })
        })
        .catch(err => console.log(err));
    };

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  })  
};