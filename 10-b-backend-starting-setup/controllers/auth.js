const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, name });
        const result = await user.save();

        res.status(201).json({ message: 'User created successfully!', userId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.signin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const { email, password } = req.body;

    try {
        let loadedUser;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('user not found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            userId: loadedUser._id.toString(),
            email: loadedUser.email
        },
            'your-secret-key', { expiresIn: '1h' });

        res.status(200).json({
            token: token,
            userId: loadedUser._id.toString()
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
