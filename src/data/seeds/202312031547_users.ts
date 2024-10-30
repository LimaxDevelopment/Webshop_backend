const { tables } = require("..");
const Role = require("../../core/roles");
const { hashPassword } = require("../../core/password");

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete();

    await knex(tables.user).insert([
      {
        userID: 1,
        firstname: "Maxim",
        lastname: "Lison",
        email: "maxim.lison@student.hogent.be",
        password_hash: await hashPassword("123456789"),
        street: "Voskeslaan",
        number: "2",
        postalcode: "9000",
        city: "Gent",
        country: "Belgium",
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        userID: 2,
        firstname: "Philip",
        lastname: "Geubels",
        email: "philip.geubels@student.hogent.be",
        password_hash: await hashPassword("123456789"),
        street: "Voskeslaan",
        number: "3",
        postalcode: "9000",
        city: "Gent",
        country: "Belgium",
        roles: JSON.stringify([Role.USER]),
      },
    ]);
  },
};
