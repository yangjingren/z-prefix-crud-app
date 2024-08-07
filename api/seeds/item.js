/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex('item_table').del()
    .then( () => {
      // Inserts seed entries
      return knex('item_table').insert([
        {id: 1, userid: 1, item_name: 'toolkit', description:'a ordinary toolkit', quantity: 2}
      ]);
    });
};
