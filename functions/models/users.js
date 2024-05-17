const { Schema, default: mongoose } = require("mongoose");

const usersSchema = new Schema({
  fullName: { type: String, required: true },
   email : { type: String, required: true },
  password: { type: String, required: true },
  roles: {type: String, required: true}
}, {
  timestamps: true,
})

const UsersModel = mongoose.model.Sights || mongoose.model("Users", usersSchema)

module.exports = UsersModel