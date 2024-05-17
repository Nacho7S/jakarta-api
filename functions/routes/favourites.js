const UsersController = require('../controller/userController');

const favourites = require('express').Router();

favourites.post("/", UsersController.addFavourites);
favourites.get("/", UsersController.getFavouriteList);

module.exports = favourites