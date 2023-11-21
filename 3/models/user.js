const Sequlize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('users', {
    id: {
        type: Sequlize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequlize.STRING,
    email: Sequlize.STRING,
});

module.exports = User;
