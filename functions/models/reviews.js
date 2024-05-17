const { Schema, default: mongoose } = require("mongoose");

const reviewsSchema = new Schema({
  userId: { type: String, required: true },
  contentId: { type: String, required: true },
  comments: {type: String, required: true},
}, {
  timestamps: true, 
})

const ReviewsModel = mongoose.model.Reviews || mongoose.model("Review", reviewsSchema)

module.exports = ReviewsModel

