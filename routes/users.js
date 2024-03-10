const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const {
  renderRegister,
  register,
  sendLogout,
  sendLogin,
  renderLogin,
} = require("../controllers/users");

router.get("/register", renderRegister);

router.post("/register", catchAsync(register));

router.get("/login", renderLogin);

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  sendLogin
);

router.get("/logout", sendLogout);

module.exports = router;
