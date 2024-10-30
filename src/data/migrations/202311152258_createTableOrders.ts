const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.order, (table) => {
      table.increments("orderID");

      table.integer("userID").unsigned().notNullable();

      table.dateTime("orderDate").notNullable();

      table
        .foreign("userID", "fk_orders_users")
        .references(`${tables.user}.userID`)
        .onDelete("CASCADE");
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.order);
  },
};
