const sequelize = require('sequelize');

const connectionstring = process.env.DATABASE_URL || 'postgres://postgres:nhan12300@localhost:8899/kingwolf'
const db = new sequelize(connectionstring);

module.exports = db;