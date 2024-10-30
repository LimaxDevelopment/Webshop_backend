const productsRepository = require("../repository/product");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");

const getAll = async () => {
  const items = await productsRepository.findAll();
  return { count: items.length, items };
};

const getById = async (id) => {
  const product = await productsRepository.findById(id);
  if (!product) {
    throw ServiceError.notFound(`No product with id ${id} exist`, { id });
  }
  return product;
};

const getByCategoryID = async (id) => {
  const product = await productsRepository.findAllWithCategoryID(id);
  if (!product) {
    throw ServiceError.notFound(`No product with id ${id} exist`, { id });
  }
  return product;
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
    const id = await productsRepository.create({
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
    return await getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (
  id,
  { categoryID, person, type, picture, productName, color, size, price, brand }
) => {
  try {
    await productsRepository.updateById(id, {
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
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await productsRepository.deleteById(id);
    if (!deleted) {
      throw ServiceError.notFound(`No product with id ${id} exist`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  getByCategoryID,
  create,
  updateById,
  deleteById,
};
