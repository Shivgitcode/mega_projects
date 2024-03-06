const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render("users/register")
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerdUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');

    }
    catch (err) {
        req.flash('error', e.message);
        res.redirect('/register');


    }



}))

router.get('/login', (req, res) => {
    res.render('users/login');

})

router.post("/login", (req, res) => {

})

module.exports = router;