const Sequlize = require('sequelize');
const sequelize = new Sequlize('node-complete', 'root', 'razidev', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;