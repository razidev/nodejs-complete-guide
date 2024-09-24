const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = {
    createUser: async function ({ userInput }, req) {
        const { email, name, password } = userInput;
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