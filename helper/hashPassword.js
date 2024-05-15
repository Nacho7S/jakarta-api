const bcryptjs = require('bcryptjs');
const SALT = bcryptjs.genSaltSync(10);

const hashPassword = (plainPassword) => {
  return bcryptjs.hashSync(plainPassword, SALT);
}

const comparePassword = (plainPassword, hashedPassword) => {
  return bcryptjs.compareSync(plainPassword, hashedPassword)
}

module.exports = {hashPassword, comparePassword}

