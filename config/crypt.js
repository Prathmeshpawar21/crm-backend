const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const verifyPassword = async (storedPassword, password) => {
  return await bcrypt.compare(storedPassword, password);
};

module.exports = { hashPassword, verifyPassword };
