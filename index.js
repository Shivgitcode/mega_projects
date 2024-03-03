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
const Review = require('./models/review')
const { reviewSchema } = require('./validation');
const campgrounds = require("./routes/campground")
const reviews = require("./routes/reviews");
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
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)



app.get("/", (req, res) => {
  res.render("home");
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
