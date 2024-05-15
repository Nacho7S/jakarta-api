const authentication = require('../middleware/authentication');
const errorHandler = require('../middleware/errorHandle');
const rateLimiterMiddleware = require('../middleware/rateLimiter');
const culinary = require('./culinary');
const favourites = require('./favourites');
const reviews = require('./reviews');
const sights = require('./sights');
const user = require('./users')

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        message: "Hello World! use this link to use the api", 
        links: "https://something.com"
    }).status(200)
})


router.use(rateLimiterMiddleware)
router.use("/sight", sights)
router.use("/culinary", culinary)
router.use("/user", user)
router.use(authentication)
router.use("/reviews", reviews)
router.use("/favourite", favourites)
router.use(errorHandler)


module.exports = router
