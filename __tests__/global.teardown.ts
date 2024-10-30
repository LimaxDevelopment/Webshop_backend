const { shutdownData, getKnex, tables } = require("../src/data");

module.exports = async () => {
  await getKnex()(tables.product).delete();
  await getKnex()(tables.category).delete();
  await getKnex()(tables.user).delete();
  await getKnex()(tables.order).delete();
  await getKnex()(tables.orderItem).delete();

  await shutdownData();
};
