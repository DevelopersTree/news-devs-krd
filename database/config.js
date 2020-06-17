const path = require('path');
require('dotenv').config({ path: path.join('../', '.env') });

const developmentConf = {
  client: 'mysql',
  connection: {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
};

const db = require('knex')({
  ...developmentConf,
});

module.exports = {
  db,
  developmentConf,
};
