const { getKnex, tables } = require("../data");
const { getLogger } = require("../core/logging");

const findAll = async () => {
  return await getKnex()(tables.user).select().orderBy("userID", "asc");
};

const findById = async (id) => {
  return await getKnex()(tables.user)
    .where(`${tables.user}.userID`, id)
    .first();
};

const findByEmail = async (email) => {
  return await getKnex()(tables.user).where("email", email).first();
};

const create = async ({
  firstname,
  lastname,
  email,
  passwordHash,
  street,
  number,
  postalCode,
  city,
  country,
  roles,
}) => {
  try {
    const [userID] = await getKnex()(tables.user).insert({
      firstname,
      lastname,
      email,
      password_hash: passwordHash,
      street,
      number,
      postalCode,
      city,
      country,
      roles: JSON.stringify(roles),
    });
    return userID;
  } catch (error) {
    getLogger().error("Error in create", { error });
    throw error;
  }
};

const updateById = async (
  id,
  { firstname, lastname, email, street, number, postalCode, city, country }
) => {
  try {
    return await getKnex()(tables.user)
      .where(`${tables.user}.userID`, id)
      .update({
        firstname,
        lastname,
        email,
        street,
        number,
        postalCode,
        city,
        country,
      });
  } catch (error) {
    getLogger().error("Error in updateById", {
      error,
    });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await getKnex()(tables.user)
      .where(`${tables.user}.userID`, id)
      .del();
  } catch (error) {
    getLogger().error("Error in deleteById", { error });
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  updateById,
  deleteById,
};
