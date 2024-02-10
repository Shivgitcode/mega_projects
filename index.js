const express = require("express");
const app = express();
const joi = require("joi")
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Mongo connected");
  })
  .catch((err) => {
    console.log("not connected");
    console.log(err);
  });

const Port = 3000;

app.use(express.urlencoded({ extended: true }));

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  const campgroundSchema = joi.object({
    campground: joi.object({
      title: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().required(),
      description: joi.string().required()
    }).required(),

  })
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }
  else {
    next()
  }

}

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds", validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground', 400)

    // const result = campgroundSchema.validate(req.body)

    // console.log(result)
    const newCampground = req.body.campground;
    const campground = new Campground(newCampground);

    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
  // res.send("It Worked!!");
  const { id } = req.params;
  // const { campground } = req.body;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh NO , Something Went Wrong!"
  res.status(statusCode).render("partials/error", { err })
  // res.send("Oh boyy!!!");
});

app.listen(Port, () => {
  console.log(`listening on Port ${Port}`);
});
