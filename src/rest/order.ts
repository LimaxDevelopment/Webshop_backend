const Router = require("@koa/router");
const orderService = require("../service/order");
const Joi = require("joi");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

const getAllOrders = async (ctx) => {
  ctx.body = await orderService.getAll();
  ctx.status = 200;
};

getAllOrders.validationScheme = null;

const getOrderById = async (ctx) => {
  ctx.body = await orderService.getById(ctx.params.orderID);
  ctx.status = 200;
};

getOrderById.validationScheme = {
  params: Joi.object({
    orderID: Joi.number().integer().positive(),
  }),
};

const getAllOrdersByUserId = async (ctx) => {
  ctx.body = await orderService.getByCategoryID(ctx.params.userID);
  ctx.status = 200;
};

getAllOrdersByUserId.validationScheme = {
  params: Joi.object({
    userID: Joi.number().integer().positive(),
  }),
};

const createOrder = async (ctx) => {
  const newOrder = await orderService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
  ctx.body = newOrder;
};

createOrder.validationScheme = {
  body: Joi.object({
    userID: Joi.number().integer().positive(),
  }),
};

const createOrderItem = async (ctx) => {
  const newOrderItem = await orderService.createOrderItem({
    ...ctx.request.body,
  });
  ctx.status = 201;
  ctx.body = newOrderItem;
};

createOrderItem.validationScheme = {
  body: Joi.object({
    orderID: Joi.number().integer().positive(),
    productID: Joi.number().integer().positive(),
  }),
};

const updateOrder = async (ctx) => {
  ctx.body = await orderService.updateById(ctx.params.orderID, {
    ...ctx.request.body,
  });
  ctx.status = 204;
};

updateOrder.validationScheme = {
  params: Joi.object({
    orderID: Joi.number().integer().positive(),
  }),
  body: Joi.object({
    userID: Joi.number().integer().positive(),
    orderItems: Joi.array().items(
      Joi.number().integer().positive(),
      Joi.number().integer().positive(),
      Joi.number().integer().positive()
    ),
    date: Joi.date(),
  }),
};

const deleteOrder = async (ctx) => {
  await orderService.deleteById(ctx.params.orderID);
  ctx.status = 204;
};

deleteOrder.validationScheme = {
  params: Joi.object({
    orderID: Joi.number().integer().positive(),
  }),
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/orders",
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllOrders.validationScheme),
    getAllOrders
  );
  router.get(
    "/:orderID",
    requireAuthentication,
    validate(getOrderById.validationScheme),
    getOrderById
  );
  router.get(
    "/users/:userID",
    requireAuthentication,
    validate(getAllOrdersByUserId.validationScheme),
    getAllOrdersByUserId
  );
  router.post(
    "/",
    requireAuthentication,
    validate(createOrder.validationScheme),
    createOrder
  );
  router.post(
    "/orderItem",
    requireAuthentication,
    validate(createOrderItem.validationScheme),
    createOrderItem
  );
  router.put(
    "/:orderID",
    requireAuthentication,
    validate(updateOrder.validationScheme),
    updateOrder
  );
  router.delete(
    "/:orderID",
    requireAuthentication,
    validate(deleteOrder.validationScheme),
    deleteOrder
  );

  app.use(router.routes()).use(router.allowedMethods());
};
