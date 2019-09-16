
exports.up = function(knex) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title', 50).notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').references('topics.slug').notNullable();
    articlesTable.string('author').references('users.username').notNullable();
    articlesTable.datetime('created_at').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('articles');
};
