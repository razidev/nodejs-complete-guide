const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { email, password, name } = req.body;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({ email, password: hashedPassword, name });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ message: 'User created successfully!', userId: result._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
