const Router = require("@koa/router");
const userService = require("../service/user");
const Joi = require("joi");
const validate = require("../core/validation");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

const checkUserID = async (ctx, next) => {
  const { userID, roles } = ctx.state.session;
  const { id } = ctx.params;

  if (userID !== id && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: "FORBIDDEN",
      }
    );
  }
  return next();
};

const getAllUsers = async (ctx) => {
  ctx.body = await userService.getAll();
  ctx.status = 200;
};

getAllUsers.validationScheme = null;

const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.userID);
  ctx.status = 200;
  ctx.body = user;
};

getUserById.validationScheme = {
  params: Joi.object({
    userID: Joi.number().integer().positive(),
  }),
};

const getByEmail = async (ctx) => {
  ctx.body = await userService.getByEmail(ctx.params.email);
  ctx.status = 200;
};

getByEmail.validationScheme = {
  params: Joi.object({ email: Joi.string().email() }),
};

const updateUser = async (ctx) => {
  ctx.body = await userService.updateById(ctx.params.userID, {
    ...ctx.request.body,
  });
  ctx.status = 204;
};

updateUser.validationScheme = {
  params: Joi.object({
    userID: Joi.number().integer().positive(),
  }),
  body: Joi.object({
    firstname: Joi.string().max(255),
    lastname: Joi.string().max(255),
    email: Joi.string().email(),
    street: Joi.string().max(255),
    number: Joi.string().max(10),
    postalCode: Joi.string().max(10),
    city: Joi.string().max(255),
    country: Joi.string().max(255),
  }),
};

const deleteUser = async (ctx) => {
  await userService.deleteById(ctx.params.userID);
  ctx.status = 204;
};

deleteUser.validationScheme = {
  params: Joi.object({
    userID: Joi.number().integer().positive(),
  }),
};

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);
  ctx.body = token;
  ctx.status = 200;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

const register = async (ctx) => {
  const token = await userService.register(ctx.request.body);
  ctx.body = token;
  ctx.status = 200;
};

register.validationScheme = {
  body: {
    firstname: Joi.string().max(255),
    lastname: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
    street: Joi.string().max(255),
    number: Joi.string().max(10),
    postalCode: Joi.string().max(10),
    city: Joi.string().max(255),
    country: Joi.string().max(255),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/users",
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers
  );
  router.get(
    "/:userID",
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserID,
    getUserById
  );
  router.get(
    "/email/:email",
    validate(getByEmail.validationScheme),
    checkUserID,
    getByEmail
  );
  router.post("/login", validate(login.validationScheme), login);
  router.post("/register", validate(register.validationScheme), register);
  router.put(
    "/:userID",
    requireAuthentication,
    validate(updateUser.validationScheme),
    checkUserID,
    updateUser
  );
  router.delete(
    "/:userID",
    requireAuthentication,
    validate(deleteUser.validationScheme),
    checkUserID,
    deleteUser
  );

  app.use(router.routes()).use(router.allowedMethods());
};
