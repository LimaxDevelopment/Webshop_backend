const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.orderItem, (table) => {
      table.increments("orderItemID");

      table.integer("orderID").unsigned().notNullable();

      table.integer("productID").unsigned().notNullable();

      table
        .foreign("orderID", "fk_orderItems_orders")
        .references(`${tables.order}.orderID`)
        .onDelete("CASCADE");

      table
        .foreign("productID", "fk_orderItems_products")
        .references(`${tables.product}.productID`)
        .onDelete("CASCADE");
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.orderItem);
  },
};
