const ordersRepository = require("../repository/order");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");

const getAll = async () => {
  const items = await ordersRepository.findAll();
  return { count: items.length, items };
};

const getById = async (id) => {
  const order = await ordersRepository.findById(id);
  if (!order) {
    throw ServiceError.notFound(`No order wit id ${id} exist`, { id });
  }
  return order;
};

const getByUserID = async (id) => {
  const order = await ordersRepository.findAllWithUserID(id);
  if (!order) {
    throw ServiceError.notFound(`No order with id ${id} exist`, { id });
  }
  return order;
};

const getByOrderItemId = async (id) => {
  const orderItem = await ordersRepository.findByOrderItemId(id);
  if (!orderItem) {
    throw ServiceError.notFound(`No orderItem with id ${id} exist`, { id });
  }
  return orderItem;
};

const create = async ({ userID }) => {
  try {
    const id = await ordersRepository.create({
      userID,
    });
    return await getById(id);
  } catch (error) {
    handleDBError(error);
  }
};

const createOrderItem = async ({ orderID, productID }) => {
  try {
    const id = await ordersRepository.createOrderItem({
      orderID,
      productID,
    });
    return await getByOrderItemId(id);
  } catch (error) {
    handleDBError(error);
  }
};

const updateById = async (id, { userID, orderItems, date }) => {
  try {
    await ordersRepository.updateById(id, {
      userID,
      orderItems,
      date,
    });
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await ordersRepository.deleteById(id);
    if (!deleted) {
      throw ServiceError.notFound(`No order with id ${id} exist`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  getByUserID,
  create,
  createOrderItem,
  updateById,
  deleteById,
};
