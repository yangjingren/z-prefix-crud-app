/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('item_table', table => {
    table.increments(); // adds an auto incrementing PK column
    table.bigInteger('userid').notNullable(); // equivalent of varchar(255)
    table.string('item_name').notNullable(); // equivalent of varchar(255)
    table.string('description', 1000).notNullable(); // equivalent of varchar(255)
    table.bigInteger('quantity').notNullable(); // equivalent of varchar(255)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('item_table');
};
