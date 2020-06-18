exports.up = (knex) => knex.schema.createTable('blacklist', (table) => {
	table.increments('id').primary();
	table.string('url', 500).notNullable().defaultTo('');
	table.datetime('created_at', { precision: 6 });
	table.charset('utf8');
	table.collate('utf8_general_ci');
});

exports.down = (knex) => knex.schema.dropTable('blacklist');
