const { getKnex, tables } = require("../data");
const { getLogger } = require("../core/logging");

const findAll = async () => {
  return await getKnex()(tables.category).select().orderBy("categoryID", "asc");
};

const findById = async (id) => {
  return await getKnex()(tables.category)
    .where(`${tables.category}.categoryID`, id)
    .first();
};

const create = async ({ name }) => {
  try {
    const [categoryID] = await getKnex()(tables.category).insert({
      name,
    });
    return await categoryID;
  } catch (error) {
    getLogger().error("Error in create", { error });
    throw error;
  }
};

const updateById = async (id, { name }) => {
  try {
    await getKnex()(tables.category)
      .where(`${tables.category}.categoryID`, id)
      .update({
        name,
      });
    return id;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await getKnex()(tables.category)
      .where(`${tables.category}.categoryID`, id)
      .del();
  } catch (error) {
    getLogger().error("Error in deleteById", { error });
    throw error;
  }
};

module.exports = { findAll, findById, create, updateById, deleteById };
