const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const newCampground = req.body.campground;
  const campground = new Campground(newCampground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground!");

  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  console.log(campground);
  if (!campground) {
    req.flash("error", "cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
