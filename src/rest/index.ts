const Router = require("@koa/router");
const installUserRouter = require("./user");
const installCategoryRouter = require("./category");
const installProductRouter = require("./product");
const installOrderRouter = require("./order");
const installHealthRouter = require("./health");

/**
 * @param {Koa} app - The Koa application.
 */

module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installUserRouter(router);
  installCategoryRouter(router);
  installProductRouter(router);
  installOrderRouter(router);
  installHealthRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
