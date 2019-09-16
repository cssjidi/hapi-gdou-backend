const Sequelize = require('sequelize');
const config = require('../config');
const fs = require('fs');

const sequelize = new Sequelize(config.DATABASE, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, {
  host: config.HOST,
  dialect: config.DATABASE_TYPE,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

fs.readdir('./', (filename) => {
	console.log(filename)
})

const model = {
	link: new link(sequelize),
}

module.exports = model