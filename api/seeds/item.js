/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex('item_table').del()
    .then( () => {
      // Inserts seed entries
      return knex('item_table').insert([
        {userid: 2, item_name: 'toolkit', description:'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum', quantity: 2},
        {userid: 2, item_name: 'toolkit1', description:'a ordinary toolkit', quantity: 3},
        {userid: 2, item_name: 'toolkit2', description:'a ordinary toolkit', quantity: 4}
      ]);
    });
};
