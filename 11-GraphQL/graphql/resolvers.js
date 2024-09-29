const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');

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
            throw new Error('Validation failed!', errors);
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
    }
};
