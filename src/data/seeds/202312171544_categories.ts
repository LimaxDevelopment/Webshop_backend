const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    await knex(tables.category).delete();

    await knex(tables.category).insert([
      { categoryID: 1, name: "Hoodies" },
      { categoryID: 2, name: "Shirts" },
      { categoryID: 3, name: "Trousers" },
      { categoryID: 4, name: "Accessories" },
    ]);
  },
};
