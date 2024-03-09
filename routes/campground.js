const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const joi = require("joi");
const { isLoggedIn } = require("../middleware");
const {
  renderNewForm,
  createCampground,
  index,
  showCampground,
} = require("../controllers/campgrounds");

// const validateCampground  = require("../validation"

const validateCampground = (req, res, next) => {
  const campgroundSchema = joi.object({
    campground: joi
      .object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required(),
      })
      .required(),
  });

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", catchAsync(index));

router.get("/new", isLoggedIn, renderNewForm);

router.post("/", isLoggedIn, validateCampground, catchAsync(createCampground));

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  res.render("campgrounds/edit", { campground });
});

router.get("/:id", isLoggedIn, catchAsync(showCampground));

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/campgrounds/${id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
