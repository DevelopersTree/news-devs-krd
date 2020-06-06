const developmentConf = {
    client: 'mysql',
    connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'r@@t',
        database : 'news-devs-krd'
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: "./migrations",
    }
}
const knex = require('knex')({
    ...developmentConf
});

module.exports = {
    knex,
    developmentConf
};