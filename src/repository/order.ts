const { getKnex, tables } = require("../data");
const { getLogger } = require("../core/logging");

const findAll = async () => {
  return await getKnex()(tables.order).select().orderBy("orderID", "asc");
};

const findById = async (id) => {
  return await getKnex()(tables.order)
    .where(`${tables.order}.orderID`, id)
    .select();
};

const findByOrderItemId = async (id) => {
  return await getKnex()(tables.orderItem)
    .where(`${tables.orderItem}.orderItemID`, id)
    .first();
};

const create = async ({ userID }) => {
  try {
    const [orderID] = await getKnex()(tables.order).insert({
      userID,
    });
    return await orderID;
  } catch (error) {
    getLogger().error("Error in create", { error });
    throw error;
  }
};

const createOrderItem = async ({ orderID, productID }) => {
  try {
    const [orderItemID] = await getKnex()(tables.orderItem).insert({
      orderID,
      productID,
    });
    return await orderItemID;
  } catch (error) {
    getLogger().error("Error in create orderItem", { error });
    throw error;
  }
};

const updateById = async (id, { userID, orderItems, date }) => {
  try {
    await getKnex()(tables.order).where(`${tables.order}.orderID`, id).update({
      userID,
      orderItems,
      date,
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
    return await getKnex()(tables.order)
      .where(`${tables.product}.orderID`, id)
      .del();
  } catch (error) {
    getLogger().error("Error in deleteById", { error });
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  findByOrderItemId,
  create,
  createOrderItem,
  updateById,
  deleteById,
};
