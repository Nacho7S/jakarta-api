const connectMongoDB = require("../config/mongodb");
const { reviews, showsReviewsWithUser } = require("../helper/showReviews");
const ReviewsModel = require("../models/reviews");
const SightsModel = require("../models/sights");
const UsersModel = require("../models/users");

class SightsController {
    static async createSight(request, respond, next) {
        const { name, description, imageUrl, facility, location } = request.body;
        try {
            let errorForm = []
            if (!name) {
                errorForm.push("please input name")
            }

            if (!description) {
                errorForm.push("please input description")
            }

            if (!imageUrl) {
                errorForm.push("please input imageUrl")
            }
            if (!facility) {
                errorForm.push("please input facility")
            }
            if (!location) {
                errorForm.push("please input location")
            }

            if (errorForm.length > 0) {
                throw ({ name: "invalidInput", error: errorForm })
            }
        const dataSight = {
            name, description, imageUrl, facility, location, archive: false
        }
        console.log(dataSight);
        await connectMongoDB()
        await SightsModel.create(dataSight)
        respond.json({message: "created sights into database"}).status(201);
        }   catch (err) {
            next(err)
        }
    }

    static async getAllSights(request, respond, next) {
        const { search, sortByName } = request.query
        console.log(search, sortByName, "test ini sights"); // liat tipe datanya dapatnya apa? -temennya kelep
        console.log(typeof(sortByName)); // buat nge cek tipe data -temennya kelpin
        try {
            await connectMongoDB()
            let query = {}
            let sights;
            
            if (search) {
                console.log("masuk sini") 
                query = { name: { $regex: `.*${search}.*`, $options: 'i' } };
            }      
            if (sortByName) {
                sights = await SightsModel.find(query).sort({ "name": Number(sortByName) }) // kenapa harus di convert ke number?
            } else {
                sights = await SightsModel.find(query)
            }
            respond.json(sights)
        }   catch (err) {
            next(err)
        }
    }

    static async getDetailSights(req, res, next) {
        const { id } = req.params
        try {
            connectMongoDB()
            const sight = await SightsModel.findOne({ _id: id })
            if (!sight) {
                throw ({name: "ContentNotFound"})
            }
            
            const reviewsSights = await reviews(id)
            const reviewWithUser = await showsReviewsWithUser(reviewsSights)

            res.json({sight: sight, reviews: reviewWithUser}).status(200)
        } catch (err) {
            next(err)
        }
    } 

    static async archiveSights(req, res, next) {
        const { id } = req.params
        try {
            connectMongoDB()
            let sight = await SightsModel.findOne({ _id: id })
            if (sight.archive === true) {
                throw {name: "invalidData"}
            }
            await SightsModel.updateOne({ _id: id }, {
                $set: {
                    archive: true
                }
            }, {
                $currentDate: { lastUpdated: true }
            })
            res.json({message: "Sight archived successfully"}).status(200)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = SightsController