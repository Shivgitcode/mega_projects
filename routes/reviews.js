const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../validation");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
// const { validateCampground, validateReview } = require("../validation")
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.delete(
  "/:reviewId",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    // res.send("Delete me!")
    res.redirect(`/campgrounds/${id}`);
  })
);

router.post(
  "/",
  isLoggedIn,
  isReviewAuthor,
  validateReview,
  catchAsync(async (req, res) => {
    // res.send('You Made It!!!')
    const campground = await Campground.findById(req.params.id);
    console.log(req.body.review);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "created new review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

module.exports = router;
