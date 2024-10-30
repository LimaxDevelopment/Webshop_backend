const { tables } = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.user, (table) => {
      table.increments("userID");

      table.string("firstname", 255).notNullable();

      table.string("lastname", 255).notNullable();

      table.string("email", 255).notNullable();

      table.string("password_hash", 255).notNullable();

      table.string("street", 255).notNullable();

      table.string("number", 255).notNullable();

      table.string("postalCode", 255).notNullable();

      table.string("city", 255).notNullable();

      table.string("country", 255).notNullable();

      table.jsonb("roles").notNullable();

      table.unique("email", "idx_user_email_unique");
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.user);
  },
};
