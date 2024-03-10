const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../validation");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const { deleteReview, addingReview } = require("../controllers/reviews");
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

router.delete("/:reviewId", isLoggedIn, catchAsync(deleteReview));

router.post(
  "/",
  isLoggedIn,
  isReviewAuthor,
  validateReview,
  catchAsync(addingReview)
);

module.exports = router;
