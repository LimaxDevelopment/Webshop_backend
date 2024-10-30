const config = require("config");
const { initializeLogger } = require("../src/core/logging");
const Role = require("../src/core/roles");
const { initializeData, getKnex, tables } = require("../src/data");
const { hashPassword } = require("../src/core/password");

module.exports = async () => {
  initializeLogger({
    level: config.get("log.level"),
    disabled: config.get("log.disabled"),
  });
  await initializeData();

  const knex = getKnex();
  await knex(tables.user).insert([
    {
      userID: 3,
      firstname: "Test",
      lastname: "User",
      email: "test.user@hogent.be",
      password_hash: await hashPassword("123456789"),
      street: "Voskeslaan",
      number: "3",
      postalCode: "9000",
      city: "Gent",
      country: "Belgium",
      roles: JSON.stringify([Role.USER]),
    },
    {
      userID: 4,
      firstname: "Admin",
      lastname: "User",
      email: "admin.user@hogent.be",
      password_hash: await hashPassword("123456789"),
      street: "Voskeslaan",
      number: "4",
      postalCode: "9000",
      city: "Gent",
      country: "Belgium",
      roles: JSON.stringify([Role.ADMIN, Role.USER]),
    },
  ]);
};
