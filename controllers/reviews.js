module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  // res.send("Delete me!")
  res.redirect(`/campgrounds/${id}`);
};

module.exports.addingReview = async (req, res) => {
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
};
