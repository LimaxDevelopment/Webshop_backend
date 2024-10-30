const categoriesRepository = require("../repository/category");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");

const getAll = async () => {
  const items = await categoriesRepository.findAll();
  return { count: items.length, items };
};

const getById = async (id) => {
  const category = await categoriesRepository.findById(id);
  if (!category) {
    throw ServiceError.notFound(`No category with id ${id} exists`, { id });
  }
  return category;
};

const create = async ({ name }) => {
  try {
    const id = await categoriesRepository.create({ name });
    return await getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (id, { name }) => {
  try {
    await categoriesRepository.updateById(id, { name });
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await categoriesRepository.deleteById(id);
    if (!deleted) {
      throw ServiceError.notFound(`No category with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = { getAll, getById, create, updateById, deleteById };
