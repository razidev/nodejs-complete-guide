const Sequlize = require('sequelize');
const sequelize = require('../util/database');

const Cart =  sequelize.define('cart', {
    id: {
        type: Sequlize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Cart;
