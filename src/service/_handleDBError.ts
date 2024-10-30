const ServiceError = require("../core/serviceError");

const handleDBError = (error) => {
  const { code = "", sqlMessage } = error;

  if (code === "ER_DUP_ENTRY") {
    switch (true) {
      case sqlMessage.includes("idx_email_unique"):
        return ServiceError.validationFailed(
          "A place with this name already exists"
        );
      case sqlMessage.includes("idx_user_email_unique"):
        return ServiceError.validationFailed(
          "There is already a user with this email address"
        );
      default:
        return ServiceError.validationFailed("This item already exists");
    }
  }

  if (code.startsWith("ER_NO_REFERENCED_ROW")) {
    switch (true) {
      case sqlMessage.includes("fk_order_user"):
        return ServiceError.notFound("This user does not exist");
      case sqlMessage.includes("fk_product_category"):
        return ServiceError.notFound("This category does not exist");
    }
  }

  return error;
};

module.exports = handleDBError;
