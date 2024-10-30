const { getKnex, tables } = require("../data");
const { getLogger } = require("../core/logging");

const findAll = async () => {
  return await getKnex()(tables.product).select().orderBy("productID", "asc");
};

const findById = async (id) => {
  return await getKnex()(tables.product)
    .where(`${tables.product}.productID`, id)
    .first();
};

const findAllWithCategoryID = async (id) => {
  return await getKnex()(tables.product)
    .select()
    .where(`${tables.product}.categoryID`, id);
};

const create = async ({
  categoryID,
  person,
  type,
  picture,
  productName,
  color,
  size,
  price,
  brand,
}) => {
  try {
    const [productID] = await getKnex()(tables.product).insert({
      categoryID,
      person,
      type,
      picture,
      productName,
      color,
      size,
      price,
      brand,
    });
    return await productID;
  } catch (error) {
    getLogger().error("Error in create", { error });
    throw error;
  }
};

const updateById = async (
  id,
  { categoryID, person, type, picture, productName, color, size, price, brand }
) => {
  try {
    await getKnex()(tables.product)
      .where(`${tables.product}.productID`, id)
      .update({
        categoryID,
        person,
        type,
        picture,
        productName,
        color,
        size,
        price,
        brand,
      });
    return id;
  } catch (error) {
    getLogger().error("Error in updateById", {
      error,
    });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await getKnex()(tables.product)
      .where(`${tables.product}.productID`, id)
      .del();
  } catch (error) {
    getLogger().error("Error in deleteById", { error });
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  findAllWithCategoryID,
  create,
  updateById,
  deleteById,
};
