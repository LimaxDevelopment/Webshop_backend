const categoryService = require("../service/category");
const Router = require("@koa/router");
const Joi = require("joi");
const validate = require("../core/validation");
const { requireAuthentication } = require("../core/auth");

const getAllCategories = async (ctx) => {
  ctx.body = await categoryService.getAll();
  ctx.status = 200;
};

getAllCategories.validationScheme = null;

const getCategoryById = async (ctx) => {
  ctx.body = await categoryService.getById(ctx.params.categoryID);
  ctx.status = 200;
};

getCategoryById.validationScheme = {
  params: Joi.object({
    categoryID: Joi.number().integer().positive(),
  }),
};

const createCategory = async (ctx) => {
  const newCategory = await categoryService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
  ctx.body = newCategory;
};

createCategory.validationScheme = {
  body: Joi.object({
    name: Joi.string().max(255),
  }),
};

const updateCategory = async (ctx) => {
  ctx.body = await categoryService.updateById(ctx.params.categoryID, {
    ...ctx.request.body,
  });
  ctx.status = 204;
};

updateCategory.validationScheme = {
  params: Joi.object({
    categoryID: Joi.number().integer().positive(),
  }),
  body: Joi.object({
    name: Joi.string().max(255),
  }),
};

const deleteCategory = async (ctx) => {
  await categoryService.deleteById(ctx.params.categoryID);
  ctx.status = 204;
};

deleteCategory.validationScheme = {
  params: Joi.object({
    categoryID: Joi.number().integer().positive(),
  }),
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/categories",
  });

  router.get(
    "/",
    validate(getAllCategories.validationScheme),
    getAllCategories
  );
  router.get(
    "/:categoryID",
    validate(getCategoryById.validationScheme),
    getCategoryById
  );
  router.post(
    "/",
    requireAuthentication,
    validate(createCategory.validationScheme),
    createCategory
  );
  router.put(
    "/:categoryID",
    requireAuthentication,
    validate(updateCategory.validationScheme),
    updateCategory
  );
  router.delete(
    "/:categoryID",
    requireAuthentication,
    validate(deleteCategory.validationScheme),
    deleteCategory
  );

  app.use(router.routes()).use(router.allowedMethods());
};
