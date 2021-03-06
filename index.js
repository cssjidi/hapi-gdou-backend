// server.js
'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Sequelize = require('sequelize');
const config = require('./src/config');
const auth = require('./src/auth');

const server = Hapi.Server({
  port: config.PROT,
  host: config.HOSTNAME
});

const sequelize = new Sequelize(config.DATABASE, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, {
  host: config.HOST,
  dialect: config.DATABASE_TYPE,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const init = async () => {
	await server.register(require('hapi-auth-jwt2'));
    await server.auth.strategy('jwt', 'jwt',
	{ key: config.SECRETCODE, 
	    validate: auth.validate,
	    verifyOptions: { algorithms: [ 'HS256' ] }
	});
	server.auth.default('jwt');
    await server.register({
      plugin: require('hapi-auto-route'),
      options: {
        routes_dir: Path.join(__dirname, './src/route')
      }
     });
    await server.register({
        plugin: require('hapi-sequelizejs'),
        options: [
            {
                name: config.DATABASE,
                models: [__dirname + '/src/model/*.js'],
                ignoredModels: [__dirname + '/src/model/index.js'], 
                sequelize: sequelize,
                sync: true,
                forceSync: false, 
            },
        ],
    })
	await server.start();
    console.log(`Server is running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (error) => {
  console.log(error);
  process.exit();
});

init();