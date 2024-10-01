const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
    createUser: async function ({ userInput }, req) {
        const { email, name, password } = userInput;

        const errors = [];
        if (!validator.isEmail(email)) {
            errors.push({ message: 'Please enter a valid email' });
        }
        if (validator.isEmpty(password) || !validator.isLength(password, { min: 5})) {
            errors.push({ message: 'Password must be at least 5 characters long' });
        }

        if (errors.length > 0) {
            const error = new Error('Invalid Input');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists!');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, name, password: hashedPassword });
        const result = await user.save();

        return {
            ...result._doc,
            _id: result._id.toString(),
        };
    },
    login: async function ({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found!');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is incorrect!');
            error.code = 401;
            throw error;
        }
        const token = await jwt.sign({
            userId: user._id.toString(),
            email: user.email
        }, 'secretjwtkey', { expiresIn: '1h' });

        return {
            token,
            userId: user._id.toString(),
        };
    },
    createPost: async function({ postInput }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const  { title, content, imageUrl } = postInput;

        const errors = [];
        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5})) {
            errors.push({ message: 'Title must be at least 5 characters long' });
        }
        if (validator.isEmpty(content) || !validator.isLength(content, { min: 5})) {
            errors.push({ message: 'Title must be at least 5 characters long' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid Input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('Invalid User');
            error.statusCode = 401;
            throw error;
        }
        const post = new Post({
            title,
            content,
            imageUrl,
            creator: user
        })
        const result = await post.save();
        user.posts.push(result);
        await user.save();

        return {
            ...result._doc,
            _id: result._id.toString(),
            createdAt: result.createdAt,
            updateAt: result.updateAt,
        }
    }
};
