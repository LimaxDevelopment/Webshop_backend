const knex = require("knex");
const { getLogger } = require("../core/logging");
const { join } = require("path");

const config = require("config");

const NODE_ENV = config.get("env");
const isDevelopment = NODE_ENV === "development";

const DATABASE_CLIENT = config.get("database.client");
const DATABASE_NAME = config.get("database.name");
const DATABASE_HOST = config.get("database.host");
const DATABASE_PORT = config.get("database.port");
const DATABASE_USERNAME = config.get("database.username");
const DATABASE_PASSWORD = config.get("database.password");
const DATABASE_SSL = config.get("database.ssl");

let knexInstance;

async function initializeData() {
  const logger = getLogger();
  logger.info("Initializing connection to the database");

  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      database: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
      ssl: DATABASE_SSL,
    },
    //debug: isDevelopment,
    migrations: {
      tableName: "knex-meta",
      directory: join("src", "data", "migrations"),
    },
    seeds: {
      directory: join("src", "data", "seeds"),
    },
  };

  knexInstance = knex(knexOptions);

  try {
    //Onderstaand wat in commentaar staat niet nodig vermits databank meteen aangemaakt wordt
    //await knexInstance.raw("SELECT 1+1 AS result");
    //await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
    //knexInstance.destroy();
    //knexOptions.connection.database = DATABASE_NAME;
    knexInstance = knex(knexOptions);
    await knexInstance.raw("SELECT 1+1 AS result");
  } catch (error) {
    logger.error(error.message, { error });
    throw new Error("Could not initialize the data layer");
  }

  try {
    await knexInstance.migrate.latest();
  } catch (error) {
    logger.error("Could not migrate database", { error });
    throw new Error("Could not migrate database");
  }

  try {
    await knexInstance.seed.run();
  } catch (error) {
    logger.error("Could not seed database", { error });
  }

  return knexInstance;
}
const getKnex = () => {
  if (!knexInstance)
    throw new Error(
      "Please initialize the data layer before getting the Knex instance"
    );
  return knexInstance;
};

const tables = Object.freeze({
  user: "users",
  category: "categories",
  product: "products",
  order: "orders",
  orderItem: "orderItems",
});

async function shutdownData() {
  const logger = getLogger();
  logger.info("Shutting down database connection");
  await knexInstance.destroy();
  knexInstance = null;
  logger.info("Database connection closed");
}

module.exports = {
  initializeData,
  getKnex,
  tables,
  shutdownData,
};
