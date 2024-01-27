const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My Backyard",
    description: "cheap camping",
  });
  await camp.save();
  res.send(camp);
});

app.listen(Port, () => {
  console.log(`listening on Port ${Port}`);
});
