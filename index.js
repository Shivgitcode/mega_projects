const express = require("express");
const app = express();
const path = require("path");

const Port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/dogs", (req, res) => {
  res.send("bow bow");
});

app.listen(Port, () => {
  console.log(`listening on Port ${Port}`);
});
