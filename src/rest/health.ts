const Router = require("@koa/router");
const healthService = require("../service/health");
const validate = require("../core/validation");

const pingen = async (ctx) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};

pingen.validationScheme = null;

const getVersie = async (ctx) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};

getVersie.validationScheme = null;

/**
 * Install health routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/health",
  });

  router.get("/ping", validate(pingen.validationScheme), pingen);
  router.get("/version", validate(getVersie.validationScheme), getVersie);

  app.use(router.routes()).use(router.allowedMethods());
};
