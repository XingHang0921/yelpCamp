const express = require('express')
const router = express.Router({mergeParams:true});
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware');
const user = require('../controllers/user');

router.route('/register')
    .get(user.registerPage)
    .post(catchAsync(user.registerUser))

router.route('/login')
    .get(user.renderLoginPage)
    .post(storeReturnTo , passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}) ,user.login)

router.get('/logout', user.logout); 

module.exports = router;