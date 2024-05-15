const UsersController = require('../controller/userController');

const reviews = require('express').Router();

reviews.post("/", UsersController.addReviews)

module.exports = reviews