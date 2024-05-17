const ReviewsModel = require("../models/reviews");
const UsersModel = require("../models/users");



const reviews = async (id) => await ReviewsModel.find({ contentId: id })

const showsReviewsWithUser = async (reviewsParamas) => {
  const mappedReviews = await Promise.all(reviewsParamas.map(async (el, index) => {
  const userReview = await UsersModel.findOne({ _id: el.userId });
  return {
    user: userReview,
      ...el.toObject()
    };
  }));

  return mappedReviews
}

module.exports = {reviews, showsReviewsWithUser}