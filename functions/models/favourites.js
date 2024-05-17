const { Schema, default: mongoose } = require("mongoose");

const favouritesSchema = new Schema({
  userId: { type: String, required: true },
  contentId: {type: String, required: true}
}, {
  timestamps: true,
})

const FavouritesModel = mongoose.model.Favourites || mongoose.model("Favourites", favouritesSchema)

module.exports = FavouritesModel