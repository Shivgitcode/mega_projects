const isLoggedIn = (req, res, next) => {
    // console.log("REQ.User...", req.user);
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in first!');
        return res.redirect('/login')
    }
    next();
}

module.exports.isLoggedIn = isLoggedIn