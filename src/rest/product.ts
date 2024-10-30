const Router = require("@koa/router");
const productService = require("../service/product");
const Joi = require("joi");
const validate = require("../core/validation");
const { requireAuthentication } = require("../core/auth");

const getAllProducts = async (ctx) => {
  ctx.body = await productService.getAll();
  ctx.status = 200;
};

getAllProducts.validationScheme = null;

const getProductById = async (ctx) => {
  ctx.body = await productService.getById(ctx.params.productID);
  ctx.status = 200;
};

getProductById.validationScheme = {
  params: Joi.object({
    productID: Joi.number().integer().positive(),
  }),
};

const getAllProductsByCategoryId = async (ctx) => {
  ctx.body = await productService.getByCategoryID(ctx.params.categoryID);
  ctx.status = 200;
};

getAllProductsByCategoryId.validationScheme = {
  params: Joi.object({
    categoryID: Joi.number().integer().positive(),
  }),
};

const createProduct = async (ctx) => {
  const newProduct = await productService.create({
    ...ctx.request.body,
  });
  ctx.body = newProduct;
  ctx.status = 201;
};

createProduct.validationScheme = {
  body: Joi.object({
    categoryID: Joi.number().integer().positive(),
    person: Joi.string().max(255),
    type: Joi.string().max(255),
    picture: Joi.string().max(255),
    productName: Joi.string().max(255),
    color: Joi.string().max(255),
    size: Joi.string().max(255),
    price: Joi.number().positive(),
    brand: Joi.string().max(255),
  }),
};

const updateProduct = async (ctx) => {
  ctx.body = await productService.updateById(ctx.params.productID, {
    ...ctx.request.body,
  });
  ctx.status = 204;
};

updateProduct.validationScheme = {
  params: Joi.object({
    productID: Joi.number().integer().positive(),
  }),
  body: Joi.object({
    categoryID: Joi.number().integer().positive(),
    person: Joi.string().max(255),
    type: Joi.string().max(255),
    picture: Joi.string().max(255),
    productName: Joi.string().max(255),
    color: Joi.string().max(255),
    size: Joi.string().max(255),
    price: Joi.number().positive(),
    brand: Joi.string().max(255),
  }),
};

const deleteProduct = async (ctx) => {
  await productService.deleteById(ctx.params.productID);
  ctx.status = 204;
};

deleteProduct.validationScheme = {
  params: Joi.object({
    productID: Joi.number().integer().positive(),
  }),
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/products",
  });

  router.get("/", validate(getAllProducts.validationScheme), getAllProducts);
  router.get(
    "/:productID",
    validate(getProductById.validationScheme),
    getProductById
  );
  router.get(
    "/category/:categoryID",
    validate(getAllProductsByCategoryId.validationScheme),
    getAllProductsByCategoryId
  );
  router.post(
    "/",
    requireAuthentication,
    validate(createProduct.validationScheme),
    createProduct
  );
  router.put(
    "/:productID",
    requireAuthentication,
    validate(updateProduct.validationScheme),
    updateProduct
  );
  router.delete(
    "/:productID",
    requireAuthentication,
    validate(deleteProduct.validationScheme),
    deleteProduct
  );

  app.use(router.routes()).use(router.allowedMethods());
};
