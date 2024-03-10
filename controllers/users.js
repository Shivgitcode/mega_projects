module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerdUser = await User.register(user, password);
    req.login(registerdUser, (err) => {
      if (err) return next(err);
    });
    req.flash("success", "Welcome to Yelp Camp!");
    res.redirect("/campgrounds");
  } catch (err) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.sendLogin = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect("/campgrounds");
};

module.exports.sendLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};
