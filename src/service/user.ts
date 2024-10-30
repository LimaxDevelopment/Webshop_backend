const usersRepository = require("../repository/user");
const handleDBError = require("./_handleDBError");
const { hashPassword, verifyPassword } = require("../core/password");
const { generateJWT, verifyJWT } = require("../core/jwt");
const ServiceError = require("../core/serviceError");
const Role = require("../core/roles");
const { getLogger } = require("../core/logging");

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in");
  }
  if (!authHeader.startsWith("Bearer")) {
    throw ServiceError.unauthorized("Invalid authentication token");
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, userID } = await verifyJWT(authToken);
    return { roles, userID, authToken };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);
  if (!hasPermission) {
    throw ServiceError.forbidden(
      "You are not allowed to view this part of the application"
    );
  }
};

const getAll = async () => {
  const items = await usersRepository.findAll();
  return { count: items.length, items };
};

const getById = async (id) => {
  const user = await usersRepository.findById(id);
  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }
  return user;
};

const getByEmail = async (email) => {
  const user = await usersRepository.findByEmail(email);
  if (!user) {
    throw ServiceError.notFound(`No user with email ${email} exists`, {
      email,
    });
  }
  return user;
};

const updateById = async (
  id,
  { firstname, lastname, email, street, number, postalCode, city, country }
) => {
  try {
    return await usersRepository.updateById(id, {
      firstname,
      lastname,
      email,
      street,
      number,
      postalCode,
      city,
      country,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await usersRepository.deleteById(id);
    if (!deleted) {
      throw ServiceError.notFound(`No user with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

const makeExposedUser = ({ userID, firstname, email, roles }) => ({
  userID,
  firstname,
  email,
  roles,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (email, password) => {
  const user = await usersRepository.findByEmail(email);
  if (!user) {
    throw ServiceError.unauthorized(
      "The given email and password do not match"
    );
  }

  const passwordValid = await verifyPassword(password, user.password_hash);
  if (!passwordValid) {
    throw ServiceError.unauthorized(
      "The given email and password do not match"
    );
  }

  return await makeLoginData(user);
};

const register = async ({
  firstname,
  lastname,
  email,
  password,
  street,
  number,
  postalCode,
  city,
  country,
}) => {
  const passwordHash = await hashPassword(password);

  const userID = await usersRepository.create({
    firstname,
    lastname,
    email,
    passwordHash,
    street,
    number,
    postalCode,
    city,
    country,
    roles: [Role.USER],
  });

  const user = await usersRepository.findById(userID);
  return await makeLoginData(user);
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  updateById,
  deleteById,
  login,
  register,
  checkAndParseSession,
  checkRole,
};
