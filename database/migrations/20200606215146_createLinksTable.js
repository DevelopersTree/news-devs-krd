
exports.up = (knex) => knex.schema.createTable('links', (table) => {
    table.increments('id').primary();
    table.string('title', 350).notNullable().defaultTo('default title');
    table.text('desc');
    table.string('thumbnail', 500).notNullable().defaultTo('http://placehold.it/200x200');
    table.string('url', 500).notNullable().defaultTo('');
    table.integer('publisher_id').notNullable().defaultTo(0);    
    table.integer('up_votes').notNullable().defaultTo(0);    
    table.datetime('created_at', { precision: 6 })
    table.datetime('post_date', { precision: 6 })
    table.charset('utf8');
    table.collate('utf8_general_ci');
  });
  
  exports.down = (knex) => knex.schema.dropTable('links');