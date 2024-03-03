const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync")
const Campground = require("../models/campground")
const Review = require("../models/review")
const ExpressError = require("../utils/ExpressError")
const { reviewSchema } = require("../validation")
// const { validateCampground, validateReview } = require("../validation")
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }

}

router.delete("/:reviewId", catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    // res.send("Delete me!")
    res.redirect(`/campgrounds/${id}`)
}))


router.post('/', validateReview, catchAsync(async (req, res) => {
    // res.send('You Made It!!!')
    const campground = await Campground.findById(req.params.id);
    console.log(req.body.review)
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))


module.exports = router