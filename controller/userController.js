const connectMongoDB = require("../config/mongodb");
const UsersModel = require("../models/users");
const SightsModel = require("../models/sights");
const culinaryModel = require("../models/culinary");
const { hashPassword, comparePassword } = require("../helper/hashPassword")
const { signToken, verifyToken } = require("../helper/jwt");
const ReviewsModel = require("../models/reviews");
const FavouritesModel = require("../models/favourites");


class UsersController {
    static async register(request, respond, next) {
        const { fullname, email, password } = request.body;
        console.log(fullname, email, password);
        try {
            let errorForm = []
            if (!fullname) {
                errorForm.push("please input fullname")
            }

            if (!email) {
                errorForm.push("please input email")
            }

            if (!password) {
                errorForm.push("please input password")
            }

            if (errorForm.length > 0) {
                throw ({ name: "invalidInput", error: errorForm })
            }
            const dataUsers = {
                fullName: fullname, email, password: hashPassword(password), roles: "Student"
            }
            await connectMongoDB() 
            const registered = await UsersModel.findOne({ email: { $regex: `.*${email}.*`, $options: 'i' } })
            console.log(registered);
            if (registered?._id) {
                throw ({name: "email/registered"})
            } else {
                await UsersModel.create(dataUsers)
                respond.json({ message: "created users into database" }).status(201);
            }

        } catch (err) {
            next(err)
        }

    }

    static async login(request, respond, next) {
        const { email, password } = request.body;
        try {
            const dataLogin = {
                email, password
            }
            let errorForm = []
            if (!email) {
                errorForm.push("please input email")
            }

            if (!password) {
                errorForm.push("please input password")
            }

            if (errorForm.length > 0) {
                throw ({ name: "invalidInput", error: errorForm })
            }
            await connectMongoDB()
            const checkUser = await UsersModel.findOne({ email: { $regex: `.*${email}.*`, $options: 'i' } })

            // console.log(checkUser, "ini email user");

            if (checkUser) { //condition
                const checkUserPass = comparePassword(dataLogin.password, checkUser.password)

                if (!checkUserPass) {
                    console.log("masuk error pass salah");
                    throw ({ name: "email/password invalid" })
                } else {
                    const token = signToken({
                        name: checkUser.fullName,
                        email: checkUser.email
                    })
                    respond.json({ token }).status(200)
                }
            } else if (!checkUser) {
                throw ({ name: "email/password invalid" })
            }
        } catch (err) {
            next(err)
        }

    }

    static async verify(req, res, next) {
        try {
            const { access_token } = req.headers
            console.log(access_token, "access token coy di user");
        
            if (!access_token) {
              throw { name: "Unauthenticated"}
            }
            
            const decoded = verifyToken(access_token)
            connectMongoDB()
            const findUser = await UsersModel.findOne({
              email: {
                $regex: `.*${decoded.email}.*`,
              },
              fullName: { $regex: `.*${decoded.name}.*` }
            })
            
            if (!findUser) {
              throw { name: "Unauthenticated" }
            }
            const user = {
              _id: findUser._id,
              name: findUser.fullName,
              email: findUser.email,
              roles: findUser.roles
            }
        
            res.status(200).json(user)
        
          } catch (err) {
            next({ name: "Unauthenticated" })
          }
        
    }

    static async addReviews(req, res, next) {
        try {
            connectMongoDB()
            const { contentId, messages } = req.body;
            const user = req.user;
            if (!messages) {
                throw { name: "invalidInput", error: ["please input message"] }
            }
            const currentUser = await UsersModel.findOne({ email: user.email });
            await ReviewsModel.create({
                userId: currentUser._id.toString(),
                contentId: contentId,
                comments: messages
            });

            res.status(201).json({ message: "Reviews created" });

        } catch (err) {
            next(err)
        }
    }

    static async getAllReviews(req, res, next) {
        try {
            await connectMongoDB(); // Ensure this function is awaited if it returns a promise
            const dataReview = await ReviewsModel.find({});
    
            const reviewsWithUserDetails = await Promise.all(dataReview.map(async (review) => {
                const user = await UsersModel.findById(review.userId);
                return {
                    ...review._doc, // Spread the review document properties
                    user: user ? {
                        _id: user._id,
                        name: user.fullName,
                        email: user.email
                    } : null // Include user details if user exists
                };
            }));
    
            res.status(200).json({ data: reviewsWithUserDetails });
        } catch (err) {
            next(err);
        }
    }
    static async addFavourites(req, res, next) {
        const { contentId } = req.body;
        const user = req.user;

        try {
            const currentUser = await UsersModel.findOne({ email: user.email });

            const [contentSights, contentCulinary] = await Promise.all([
                SightsModel.findOne({ _id: contentId }),
                culinaryModel.findOne({ _id: contentId })
            ]);

            if (contentSights) {
                console.log("masuk sights");
                console.log(contentSights);
                await FavouritesModel.create({
                    userId: currentUser._id.toString(),
                    contentId: contentSights._id.toString(),
                });
            } else if (contentCulinary) {
                console.log("masuk culinary");
                console.log(contentCulinary);
                await FavouritesModel.create({
                    userId: currentUser._id.toString(),
                    contentId: contentCulinary._id.toString(),
                });
            } else {
                console.log("masuk error");
                throw { name: "ContentNotFound", message: "Content with the specified ID not found" };
            }

            res.status(201).json({ message: "new Favourite created" });

        } catch (err) {
            next(err)
        }
    }

    static async getFavouriteList(req, res, next) {
        const user = req.user
        try {
            connectMongoDB()
            const currentUser = await UsersModel.findOne({ email: user.email });
            const currentUserFavourite = await FavouritesModel.find({ userId: currentUser._id.toString() })

            const mappedFavouriteData = await Promise.all(currentUserFavourite.map(async (el, index) => {
                const [contentSights, contentCulinary] = await Promise.all([
                    SightsModel.findOne({ _id: el.contentId }),
                    culinaryModel.findOne({ _id: el.contentId })
                ]);

                return {
                    ...el.toObject(),
                    content: contentSights ? contentSights : contentCulinary
                }
            }))
            res.json({ favourites: mappedFavouriteData }).status(200)

        } catch (err) {
            next(err)
        }
    }
}

module.exports = UsersController