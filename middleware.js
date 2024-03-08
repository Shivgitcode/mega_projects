const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

const isLoggedIn = (req, res, next) => {
  // console.log("REQ.User...", req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isLoggedIn = isLoggedIn;
module.exports.storeReturnTo = storeReturnTo;
