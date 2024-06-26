const UsersController = require('../controller/userController');

const user = require('express').Router();

user.post("/register", UsersController.register)
user.post("/login", UsersController.login)
user.post("/verify", UsersController.verify)

module.exports = user