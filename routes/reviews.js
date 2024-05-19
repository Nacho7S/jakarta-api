const UsersController = require('../controller/userController');

const reviews = require('express').Router();

reviews.post("/", UsersController.addReviews)
reviews.get("/", UsersController.getAllReviews)

module.exports = reviews