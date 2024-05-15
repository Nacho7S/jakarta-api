const connectMongoDB = require("../config/mongodb");
const { reviews, showsReviewsWithUser } = require("../helper/showReviews");
const CulinaryModel = require("../models/culinary");

class CulinaryController {
    static async createCulinary(request, respond, next) {
        const { name, description, imageUrl, popularLocation } = request.body;
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
            if (!popularLocation) {
                errorForm.push("please input popularLocation")
            }

            if (errorForm.length > 0) {
                throw ({ name: "invalidInput", error: errorForm })
            }
        // console.log(request.body);
        const dataCulinary = {
            name, description, imageUrl, popularLocation, archive: false
        }
        console.log(dataCulinary);
        await connectMongoDB()
        await CulinaryModel.create(dataCulinary)
        respond.json({message: "created culinary into database"}).status(201);
        }   catch (err) {
            next(err)
        }
    }

    static async getAllCulinary(request, respond, next) {
        const { search, sortByName } = request.query
        console.log(search, sortByName, "test ini culinary");
        try {
            await connectMongoDB()
            let query = {}
            let culinary; 
            
            if (search) {
                console.log("masuk sini")
                query = { name: { $regex: `.*${search}.*`, $options: 'i' } };
            }      
            if (sortByName) {
                culinary = await CulinaryModel.find(query).sort({ "name": Number(sortByName) })
            } else {
                culinary = await CulinaryModel.find(query)
            }
            // culinary = await CulinaryModel.find({})
            respond.json(culinary).status(200)
        } catch (err) {
            next(err)
        }

    }

    static async getCulnary(req, res, next) {
        const { id } = req.params
        try {
            connectMongoDB()
            const culinary = await CulinaryModel.findOne({ _id: id })
            if (!culinary) {
                throw ({name: "ContentNotFound"})
            }

            const reviewsCulinary = await reviews(id);
            const reviewWithUser = await showsReviewsWithUser(reviewsCulinary);

            res.json({culinary: culinary, reviews: reviewWithUser}).status(200)
        } catch (err) {
            console.log(err);
            next(err)
        }
    }

    static async archiveCulinary(req, res, next) {
        const { id } = req.params
        // const {isArchive} = req.body
        try {
            connectMongoDB()
            let culinary = await CulinaryModel.findOne({ _id: id })
            if (culinary.archive === true) {
                throw {name: "invalidData"}
            }
            await CulinaryModel.updateOne({ _id: id }, {
                $set: {
                    archive: true
                }
            }, {
                $currentDate: { lastUpdated: true }
            })
            res.json({message: "Culinary archived successfully"}).status(200)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = CulinaryController