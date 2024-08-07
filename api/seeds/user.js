/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex('user_table').del()
    .then( () => {
      // Inserts seed entries
      return knex('user_table').insert([
        {id: 1, first_name: 'john', last_name: 'smith', username:'admin', password:'aasdad'}
      ]);
    });
};
