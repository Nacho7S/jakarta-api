const SightsController = require('../controller/sightsController');
const authentication = require('../middleware/authentication');
const adminAuthorization = require('../middleware/authorization');
const sights = require('express').Router();

sights.get("/", SightsController.getAllSights);
sights.get("/:id", SightsController.getDetailSights);
sights.use(authentication)
sights.post("/", adminAuthorization,SightsController.createSight);
sights.delete("/:id", SightsController.archiveSights);
module.exports = sights