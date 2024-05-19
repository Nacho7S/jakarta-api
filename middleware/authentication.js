const connectMongoDB = require("../config/mongodb");
const { verifyToken } = require("../helper/jwt");
const UsersModel = require("../models/users");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers
    console.log(access_token, "access token coy");

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
    req.user = {
      _id: findUser._id,
      name: findUser.fullName,
      email: findUser.email,
      roles: findUser.roles
    }

    next()

  } catch (err) {
    next({ name: "Unauthenticated" })
  }

}

module.exports = authentication