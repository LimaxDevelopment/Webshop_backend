const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.product, (table) => {
      table.increments("productID");

      table.integer("categoryID").unsigned().notNullable();

      table.string("person", 255).notNullable();

      table.string("type", 255).notNullable();

      table.string("picture", 255).notNullable();

      table.string("productName", 255).notNullable();

      table.string("color", 255).notNullable();

      table.string("size", 255).notNullable();

      table.double("price").notNullable();

      table.string("brand", 255).notNullable();

      table
        .foreign("categoryID", "fk_products_categories")
        .references(`${tables.category}.categoryID`)
        .onDelete("CASCADE");
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.product);
  },
};
