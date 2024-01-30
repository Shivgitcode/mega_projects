const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("not connected");
    console.log(err);
  });

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/4883251",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate, atque soluta ut harum fuga necessitatibus, aperiam aspernatur iste quibusdam iure nihil maxime excepturi, deserunt autem natus! Soluta laboriosam eius saepe.",
      price: price,
    });

    await camp.save();
  }
};

seedDB();
