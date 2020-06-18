exports.up = (knex) => knex.schema.createTable('link_votes', (table) => {
	table.increments('id').primary();
	table.integer('publisher_id').notNullable().defaultTo(0);
	table.integer('link_id').notNullable().defaultTo(0);
	table.datetime('created_at', { precision: 6 });
	table.charset('utf8');
	table.collate('utf8_general_ci');
});

exports.down = (knex) => knex.schema.dropTable('link_votes');
