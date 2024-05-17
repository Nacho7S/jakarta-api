const CulinaryController = require('../controller/culinaryController');
const authentication = require('../middleware/authentication');
const adminAuthorization = require('../middleware/authorization');

const culinary = require('express').Router();

culinary.get("/", CulinaryController.getAllCulinary);
culinary.get("/:id", CulinaryController.getCulnary);
culinary.use(authentication)
culinary.post("/", adminAuthorization, CulinaryController.createCulinary);
culinary.delete("/:id", CulinaryController.archiveCulinary);

module.exports = culinary